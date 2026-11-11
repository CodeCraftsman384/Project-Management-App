import { useEffect, useState } from "react";
import dayjs from "dayjs"
import toast from "react-hot-toast"
import MembersAvatar from "../../components/inputs/MembersAvatar";
import axiosInstance from "../../utils/axiosHelper";
import { TASKS } from "../../utils/apiPaths";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

function ViewTaskDetails({currentTask,closeModal}){

    const [tempToDoList,setTempToDoList] = useState([]);
    const [tempStatus,setTempStatus] = useState("");

    const getStatusTagColor = (status)=>{
        switch(status){
            case "In progress":
                return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
            case "Completed":
                return "text-lime-500 bg-lime-50 border border-lime-500/10";
            default:
                return "text-violet-500 bg-violet-50 border border-violet-500/10";
        }
    }

    useEffect(()=>{
        if(!currentTask) return;        
        setTempToDoList(currentTask.todoCheckList); 
        setTempStatus(currentTask.status);
    },[currentTask]);

    const handleChange = (idx)=>{
        const updatedList = tempToDoList.map((item,index)=>index===idx ? {...item,completed : !item.completed} : item);
        setTempToDoList(updatedList);
        const completedCount = updatedList.filter(item=>item.completed).length;
         if (completedCount === 0) {
            setTempStatus("Pending");
        } else if (completedCount === updatedList.length) {
            setTempStatus("Completed");
        } else {
            setTempStatus("In progress");
        }
    }

    const handleCancel = ()=>{
        setTempToDoList(currentTask.todoCheckList);
        setTempStatus(currentTask.status);
        closeModal();
    }

    const handleAssign = ()=>{
        toast.promise(async()=>{
            try{
                const response = await axiosInstance.put(TASKS.updateTodoList,{todoCheckList:tempToDoList},{id:currentTask._id})
                closeModal();
                return response.data;
            }catch(e){
                console.log(e);
                throw e;
            }
            },{
                loading: "Updating your Task Checklist...",
                success: <b>Task list Updated Successfully!</b>,
                error: <b>Could not update task list. Please try again.</b>
            }
        )
        
    }

    const handleClick = (link)=>{
        if(!/^https?:\/\//i.test(link)){
            link = "https://"+link;
        }
        window.open(link, "_blank", "noopener,noreferrer");
    }

    const attachments = currentTask.attachment || [];

    return(        
        <div className="flex max-h-[calc(100dvh-9rem)] flex-col">
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">              
                <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="min-w-0 flex-1 break-words text-lg font-medium sm:text-xl">
                        {currentTask.title}
                    </h2>
                    <div
                        className={`shrink-0 whitespace-nowrap rounded px-3 py-0.5 text-[13px] font-medium ${getStatusTagColor(tempStatus)}`}
                    >
                        {tempStatus}
                    </div>
                </div>

                <InfoBox label="Description" value={currentTask.description || "No description"}></InfoBox>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {/* Priority */}
                    <InfoBox label="Priority" value={currentTask.priority}/>                  
                    {/* due date */}
                    <InfoBox label="Due Date" value={dayjs(currentTask.dueDate).format("DD MMMM YYYY")}/>
                    {/* Assigned To */}
                    <InfoBox label="Assigned To">
                        <MembersAvatar selectedMembersAvatars={(currentTask.assignedTo || []).map(item=>item.profileImageUrl)} maxVisible={5}/>
                    </InfoBox>
                </div> 
                <div>
                    <label className="text-xs font-medium text-slate-500">ToDo Checklist</label>              
                    <div className="mt-1 space-y-1">    
                    {
                        currentTask.todoCheckList?.map((item,idx)=>{
                            return(
                                <TodoCheckList 
                                    itemKey={`todo_${idx}`}
                                    key={`todo_${idx}`}
                                    text={item.text}
                                    onChange={()=>handleChange(idx)}
                                    checked={!!tempToDoList[idx]?.completed}
                                />
                            )
                        })
                    }
                    </div>      
                </div>
                { 
                attachments.length>0 && 
                (<div>
                    <label className="text-xs font-medium text-slate-500">Attachments</label>
                    <div className="mt-1 space-y-2">
                    {
                        attachments.map((link,index)=>(
                            <ShowAttachment key={`link_${index}`} index={index} link={link} onClick={()=>handleClick(link)}/>
                        ))
                    }
                    </div>
                </div>)     
                }
            </div>
            <div className="mt-4 flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end sm:gap-4">
                <button className="card-btn w-full sm:w-auto" type="button" onClick={handleCancel}>
                    Cancel
                </button>
                <button className="card-btn-fill w-full sm:w-auto" type="button" onClick={handleAssign}>
                    Save
                </button>
            </div>           
        </div>       
    )
}

export default ViewTaskDetails;

function InfoBox({label,children,value}){
    return(
        <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500">{label}</label>
            {children ? <div className="mt-0.5">{children}</div> : <p className="text-[12px] font-medium text-gray-700 mt-0.5">{value}</p>}
        </div>
    )
}

function TodoCheckList({itemKey,text,checked=false,onChange}){
    return (
        <div className="flex items-center gap-3">
            <input 
                    id={itemKey}
                    type="checkbox" 
                    onChange={onChange}
                    checked={Boolean(checked)}
                    className="text-primary w-4 h-4 bg-gray-100 border-gray-300 rounded-sm shrink-0 outline-none cursor-pointer"
                    />
            <label htmlFor={itemKey} className="cursor-pointer text-[13px] text-gray-800">
                {text}
            </label>
        </div>
    )
}

function ShowAttachment({index,link,onClick}){
    return(
        <div 
        className="flex justify-between bg-gray-50 border border-gray-100 px-2 py-2 rounded-mb cursor-pointer" 
        onClick={onClick}>
            <div className="flex-1 flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-400">{index<9?`0${index+1}`:`${index}`}</span>
                <p className="text-xs text-black">{link}</p>
            </div>
            <LuSquareArrowOutUpRight className="text-gray-400"/>
        </div>
    )
}