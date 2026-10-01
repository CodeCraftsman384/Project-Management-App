import { useState } from "react"
import { FaTrashAlt } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";

function ToDoList({SubTasks,onChange}){
    const [newSubTask,setNewSubTask] = useState("");

    const handleAddSubTask = ()=>{
        if(newSubTask.trim()){
            const updatedArr = [...SubTasks,newSubTask.trim()];
            onChange(updatedArr);
            setNewSubTask("");
        }
    }

    const handleDeleteSubTask = (index)=>{
        const updatedArr = SubTasks.filter((_,idx)=>idx !== index);
        onChange(updatedArr);
    }

    return(
        <div className="mt-0">                            
            {/* Show all subtask along with delete option */}
            {
                SubTasks.map((subtask,index)=>(
                    <div 
                        key={index}
                        className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mt-2 mb-3"
                    >
                        <p className="text-xs text-black">
                            <span className="text-xs font-semibold text-gray-400 mr-3">{index<9 ? `0${index+1}` : index+1}</span>
                            {subtask}
                        </p>                                                                                      
                        {/* delete button */}
                        <button className="cursor-poinetr" type="button" onClick={()=>handleDeleteSubTask(index)}>
                            <FaTrashAlt color="red" size={15} />
                        </button>
                    </div>
                ))
            }
            {/* add subtask */}
            <div className="flex items-center gap-5 mt-3">
                    <input 
                    type="text" 
                    value={newSubTask} 
                    onChange={(e)=>setNewSubTask(e.target.value)}
                    placeholder="Enter Sub Task"
                    className="w-full text-[13px] text-black placeholder:text-gray-500 outline-none bg-white border border-slate-500 px-3 py-2 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    />
                    <button className="card-btn text-nowrap" type="button" onClick={handleAddSubTask}>
                        <LuPlus className="text-lg"/>
                        Add
                    </button>
                </div>
        </div>
    )
}
export default ToDoList