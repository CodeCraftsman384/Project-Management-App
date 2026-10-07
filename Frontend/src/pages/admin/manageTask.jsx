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

function ManageTask(){
    useUserAuth();
    const [tasks,setTasks] = useState([]); //will get array of objects

    const statusColor = [{label : "Pending", text:"text-violet-500", bg : "bg-violet-500", border : "border-violet-500/10"},
                        {label : "In progress", text:"text-cyan-500", bg : "bg-cyan-500", border : "border-cyan-500/10"},
                        {label : "Completed", text:"text-lime-500", bg : "bg-lime-500", border : "border-lime-500/20"}]

    const priorityColor = [{label : "High", text:"text-rose-500", bg : "bg-rose-50", border : "border-rose-500/10"},
                        {label : "Medium", text:"text-amber-500", bg : "bg-amber-50", border : "border-amber-500/10"},
                        {label : "Low", text:"text-emerald-500", bg : "bg-emerald-50", border : "border-emerald-500/20"}]

    const [tabs,setTabs] = useState([]); //array of object containing tab name and count key
    const [activeTab,setActiveTab] = useState("All");

    const handleTabChange = (tab)=>{
        if(activeTab !== tab.label){
            setActiveTab(tab.label);
        }
    }
    const navigate = useNavigate();

    const handleClick = (task)=>{
        navigate('/admin/new-Task',{state : {taskId : task._id}});
    }

    useEffect(()=>{
        const getTasks = async()=>{
            try{
                console.log(activeTab)
                const filter = activeTab !== "All" ? {status : activeTab} : {};
                const response = await axiosInstance.get(TASKS.getTasks,{params : filter});
                if(response.data.success){
                    console.log(response);
                    setTasks(response.data.tasks);
                    setTabs([
                        {label : "All", count : response.data.totalTasksCount || 0},
                        {label : "Completed", count : response.data.completedTasksCount || 0},
                        {label : "In progress", count : response.data.inProgressTasksCount || 0},
                        {label : "Pending", count : response.data.pendingTasksCount || 0},
                    ])
                }
            }catch(e){
                 console.log("Error-> ",e);
            }
        }
        getTasks();
    },[activeTab])

    return(
        <DashboardLayout activeMenu="Manage Tasks">
            <div className="mt-5">
                <div className="flex flex-column lg:flex-row lg:items-center jusitify-between">
                    <div>
                        <h2 className="text-xl font-medium">My Tasks</h2>
                    </div>
                    <div>
                        {
                            tabs.map((tab,index)=>(
                                <button 
                                    key={index} 
                                    onClick={()=>handleTabChange(tab)}
                                    className={`relative px-3 md:px-4 py-2 text-sm font-medium ${activeTab === tab.label ? "text-primary" : "text-gray-500 hover:text-gray-700"} cursor-pointer`}>
                                        <div className="flex items-center">
                                            <span className="text-xs">{tab.label}</span>
                                            <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${activeTab === tab.label ? "bg:primary text-white" : "bg-gray-200/70 text-gray-600"}`}>{tab.count}</span>
                                        </div>
                                        {
                                            activeTab===tab.label && 
                                            <div className="left-0 bottom-0 absolute bg-primary h-0.5 w-full "/>
                                        }
                                    </button>
                            ))
                        }
                    </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {
                        tasks.map((task,index)=>(
                            <div 
                            key={index}
                            className="bg-white rounded-xl px-4 shadow:md shadow-gray-100 border border-gray-200/50 cursor-pointer"
                            onClick={()=>handleClick(task)}>
                                <div className="flex items-end gap-3 px-4">
                                    <Badge colourArr={statusColor} value={task.status}/>
                                    <Badge colourArr={priorityColor} value={task.priority}/>
                                </div>
                                <div className={`shrink-0 rounded-full px-4 border-l-[3px] ${statusColor.find(obj=>obj.label===task.status)?.border}`}>                          
                                    {/* title */}
                                    <p className="text-sm font-medium mt-4 line-clamp-1 text-gray-800">{task.title}</p>
                                    {/* Desc */}
                                    <p className="text-sm font-medium mt-1.5 line-clamp-2 text-gray-500 leading-[18px]">{task.description || "No description"}</p>
                                    <div className="text-[13px] text-gray-700/80 mt-2 mb-2 font-medium leading-[18px]">
                                        Sub Tasks Done :{" "} 
                                        <span className="font-semibold text-gray-700">{task.completedTodoCount}/{task.todoCheckList.length}</span>
                                    </div>
                                    <ProgressBar progress={task.progress} statusObj={statusColor.find(obj=>obj.label===task.status)}/>
                                </div>                                                                            
                                <div className="pt-2">
                                    <div className="flex items-center justify-between">
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
                                    <div className="flex items-center justify-between">
                                        {/* Assigned to */}
                                        {<MembersAvatar selectedMembersAvatars={task.assignedTo.map(item=>item.profileImageUrl)} maxVisible={3}/>}
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
            </div>
        </DashboardLayout>
    )
}
export default ManageTask