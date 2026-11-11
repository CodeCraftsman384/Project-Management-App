import { useEffect, useState } from "react"
import DashboardLayout from "../layout/DashboardLayout"
import { TASKS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosHelper";
import useUserAuth from "../../hooks/UseUserAuth";
import Badge from "../../components/Badge"
import MembersAvatar from "../../components/inputs/MembersAvatar";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../../components/ProgressBar";
import { LuCircleDashed, LuPaperclip } from "react-icons/lu";
import Modal from "../../components/inputs/Modal";
import ViewTaskDetails from "./viewTaskDetails";

function MyTasks(){
    useUserAuth();
    const [tasks,setTasks] = useState([]); //will get array of objects
    const [currentTask,setCurrentTask] = useState({});
    const statusColor = [{label : "Pending", text:"text-violet-500", bg : "bg-violet-50", border : "border-violet-500/10"},
                        {label : "In progress", text:"text-cyan-500", bg : "bg-cyan-50", border : "border-cyan-500/10"},
                        {label : "Completed", text:"text-lime-500", bg : "bg-lime-50", border : "border-lime-500/20"}]

    const priorityColor = [{label : "High", text:"text-rose-500", bg : "bg-rose-50", border : "border-rose-500/10"},
                        {label : "Medium", text:"text-amber-500", bg : "bg-amber-50", border : "border-amber-500/10"},
                        {label : "Low", text:"text-emerald-500", bg : "bg-emerald-50", border : "border-emerald-500/20"}]

    const [tabs,setTabs] = useState([]); //array of object containing tab name and count key
    const [activeTab,setActiveTab] = useState("All");
    const [isModalOpen,setIsModalOpen] = useState(false);

    const handleTabChange = (tab)=>{
        if(activeTab !== tab.label){
            setActiveTab(tab.label);
        }
    }

    const handleClick = (task)=>{
        setIsModalOpen(true);
        setCurrentTask(task);
    }

    useEffect(()=>{
        const getTasks = async()=>{
            try{
                const filter = activeTab !== "All" ? {status : activeTab} : {};
                const response = await axiosInstance.get(TASKS.getTasks,{params : filter});
                if(response.data.success){
                    setTasks(response.data.tasks);
                    setTabs([
                        {label : "All", count : response.data.totalTasksCount || 0},
                        {label : "Pending", count : response.data.pendingTasksCount || 0},
                        {label : "In progress", count : response.data.inProgressTasksCount || 0},
                        {label : "Completed", count : response.data.completedTasksCount || 0},
                    ])
                }
            }catch(e){
                 console.log("Error-> ",e);
            }
        }
        getTasks();
    },[activeTab,isModalOpen])

    return(
        <DashboardLayout activeMenu="Manage Task">
            <div className="mt-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">                    
                    
                    <h2 className="text-xl font-medium">My Tasks</h2>

                    <div className="grid grid-cols-2 gap-x-2 sm:flex sm:gap-0 sm:overflow-x-auto">
                        {
                            tabs.map((tab,index)=>{
                                const isActive = activeTab === tab.label;
                                return (
                                    <button 
                                        key={index} 
                                        onClick={()=>handleTabChange(tab)}
                                        className={`flex items-center justify-center whitespace-nowrap px-3 md:px-4 py-2 text-xs font-medium sm:border-b-2 ${isActive ? "text-primary border-primary bg-primary/10 rounded-md sm:bg-transparent sm:rounded-none" : "text-gray-500 hover:text-gray-700 border-transparent"} cursor-pointer`}>                                        
                                            <span>{tab.label}</span>
                                            <span className={`ml-2 px-2 py-0.5 rounded-full ${isActive ? "bg-primary text-white" : "bg-gray-200/70 text-gray-600"}`}>{tab.count}</span>                                        
                                            
                                   </button>
                                )})
                        }
                    </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
                    {
                        tasks.map((task,index)=>(
                            <div 
                            key={index}
                            className="flex flex-col bg-white rounded-xl px-4 py-4 shadow:md shadow-gray-100 border border-gray-200/50 cursor-pointer"
                            onClick={()=>handleClick(task)}>
                                <div className="flex items-end gap-3 px-4">
                                    <Badge colourArr={statusColor} value={task.status} label="status"/>
                                    <Badge colourArr={priorityColor} value={task.priority} label="priority"/>
                                </div>
                                <div className={`px-4 border-l-[3px] 
                                    ${task.status==="Pending"
                                        ? "border-violet-500"
                                        : task.status==="In progress"  
                                        ? "border-cyan-500"
                                        : "border-lime-500"}`
                                    }>                          
                                    {/* title */}
                                    <p className="text-sm font-medium mt-4 line-clamp-1 text-gray-800">{task.title}</p>
                                    {/* Desc */}
                                    <p className="text-sm font-medium mt-1.5 min-h-[36px] line-clamp-2 text-gray-500 leading-[18px]">{task.description || "No description"}</p>
                                    <div className="text-[13px] text-gray-700/80 mt-2 mb-2 font-medium leading-[18px]">
                                        Sub Tasks Done :{" "} 
                                        <span className="font-semibold text-gray-700">{task.completedTodoCount}/{task.todoCheckList.length}</span>
                                    </div>
                                    <ProgressBar progress={task.progress} statusObj={statusColor.find(obj=>obj.label===task.status)}/>
                                </div>                                                                            
                                <div className="px-4">
                                    <div className="flex items-center justify-between my-1">
                                        <div>
                                            {/* Start Date */}
                                            <label className="text-xs text-gray-500">Start Date</label>
                                            <p className="text-[13px] font-medium text-gray-900">{dayjs(task.createdAt).format("DD MMM YYYY")}</p>
                                        </div>
                                        <div>
                                            {/* Due Date */}
                                            <label className="text-xs text-gray-500">Due Date</label>
                                            <p className="text-[13px] font-medium text-gray-900">{dayjs(task.dueDate).format("DD MMM YYYY")}</p>
                                        </div>                                        
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        {/* Assigned to */}
                                        {task.assignedTo.length > 0 
                                        ? (<MembersAvatar selectedMembersAvatars={task.assignedTo.map(item=>item.profileImageUrl)} maxVisible={3}/>)
                                        : (<div className="flex items-center gap-1.5 text-gray-400">
                                                <LuCircleDashed className="w-9 h-9" />
                                                <span className="text-sm">Unassigned</span>
                                            </div>)}
                                        {/* Attachment number */}
                                        {task.attachment.length > 0 && 
                                            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
                                                <LuPaperclip className="text-primary"/>{" "}
                                                <span className="text-xs text-gray-900">{task.attachment.length}</span>
                                            </div>}
                                    </div>                                                                            
                                </div>
                            </div>
                        ))
                    }
                </div>

                {isModalOpen && 
                    <Modal title="View Task">
                        <ViewTaskDetails currentTask={currentTask} closeModal={()=>setIsModalOpen(false)}/>
                    </Modal>
                }
            </div>
        </DashboardLayout>
    )
}
export default MyTasks