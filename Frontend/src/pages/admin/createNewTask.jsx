import { useState } from "react";
import useUserAuth from "../../hooks/UseUserAuth"
import DashboardLayout from "../layout/DashboardLayout"
import DropDown from "../../components/inputs/DropDown";
import SelectMembers from "../../components/inputs/SelectMembers";
import ToDoList from "../../components/inputs/ToDoList";
import Attachment from "../../components/inputs/Attachment";
import {TASKS} from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosHelper";
import toast from "react-hot-toast"

function CreateNewTask(){
    useUserAuth();

    const [taskData,setTaskData] = useState({
        title : "",
        description : "",
        priority : "Medium",
        dueDate : new Date().toLocaleDateString('en-CA'),
        assignedTo : [],
        todoCheckList : [],
        attachment : ["https://react.dev","https://tailwindcss.com"]
    });

    const PRIORITY_DATA = ["High","Medium","Low"];

    const handleValueChange = (key,value)=>{
        setTaskData({...taskData,[key]:value})
    }

    const clearData = ()=>{
        setTaskData({
            title : "",
            description : "",
            priority : "Medium",
            dueDate : new Date().toLocaleDateString('en-CA'),
            assignedTo : [],
            todoCheckList : [],
            attachment : ["https://react.dev","https://tailwindcss.com"]
        })
    }

    const handleCreateTask = (e)=>{
        console.log("Create Task is running");
        e.preventDefault();
        if(taskData.title.trim()===""){
            toast.error("Kindly enter title");
            return;
        }
        // payload = taskData
        toast.promise(async()=>{
            try{
                const toDoList = taskData.todoCheckList.map((subtask)=>({text:subtask,completed:false}))
                const response = await axiosInstance.post(TASKS.createTask,{
                    ...taskData,
                    todoCheckList:toDoList
                });
                console.log(response)
                if(response.data.success){
                    console.log(response.data.newTask);
                }
                clearData();
                return response.data; //returning it to resolve promise successfully
            }catch(e){
                console.log(e);
                throw e;
            }
        },{
            loading: "Creating your task...",
            success: <b>Task Created Successfully!</b>,
            error: <b>Could not save task. Please try again.</b>
        })        
    }
    
    return (
        <DashboardLayout activeMenu={"Create Task"}>
            <div className="mt-5">
                <div className="grid grid-cols-1 md:grid-col-4 mt-4">
                    <div className="form-card">                       
                        <h1>Create New Task</h1>
                        <form onSubmit={handleCreateTask} >
                            {/* title */}
                            <div className="mt-4">
                                <label className="text-sm font-medium text-slate-600">Title</label>
                                <input 
                                    className="form-input"
                                    value={taskData.title}
                                    onChange={(e)=>handleValueChange("title",e.target.value)}
                                    label="Title"
                                    placeholder="Enter title"
                                    type="text"
                                />
                            </div>
                            {/* Description */}
                            <div className="mt-3">
                                <label className="text-sm font-medium text-slate-600">Description</label>
                                <textarea 
                                className="form-input"
                                value={taskData.description}
                                onChange={(e)=>handleValueChange("description",e.target.value)}                            
                                placeholder="Describe Task (optional)"                          
                                rows={4}
                                />
                            </div>
                            <div className="grid grid-cols-12 gap-x-4 gap-y-3 mt-3">
                                {/* Priority*/}
                                <div className="col-span-12 min-w-0 sm:col-span-6 md:col-span-4">
                                    <label className="block text-sm font-medium text-slate-600">Priority</label>
                                    <DropDown
                                    options={PRIORITY_DATA}
                                    value={taskData.priority}
                                    onChange={(value)=>handleValueChange("priority",value)}
                                    placeholder="Select an option"  
                                    />
                                </div>
                                {/* Due Date */}
                                <div  className="col-span-12 min-w-0 sm:col-span-6 md:col-span-4">
                                    <label className="block w-full min-w-0 appearance-none text-sm font-medium text-slate-600">Due Date</label>
                                    <input 
                                    value={taskData.dueDate}
                                    onChange={(e)=>handleValueChange("dueDate",e.target.value)}
                                    type="date"
                                    className="form-input"
                                    />
                                </div>
                                {/* Assign Members */}
                                <div className="col-span-12 min-w-0 sm:col-span-6 md:col-span-4">
                                    <label className="block text-sm font-medium text-slate-600">Select Members</label>
                                    <SelectMembers 
                                    selectedMembers={taskData.assignedTo}
                                    onChange={(selectedMembers)=>handleValueChange("assignedTo",selectedMembers)}/>
                                </div>
                            </div>
                            {/* ToDo  */}
                            <div className="mt-3">
                                <label className="text-sm font-medium text-slate-600">To Do CheckList</label>
                                <ToDoList 
                                SubTasks={taskData.todoCheckList}
                                onChange={(subtasks)=>{
                                    handleValueChange("todoCheckList",subtasks);
                                }}/>
                            </div>
                            {/* Add Attachments */}
                            <div className="mt-3">
                                <label className="text-sm font-medium text-slate-600">Add Attachments</label>
                                <Attachment 
                                attachments={taskData.attachment}
                                onChange={(updatedArr)=>handleValueChange("attachment",updatedArr)} />
                            </div>
                            <div className="flex justify-end mt-3">
                                <button type="submit" className="add-btn">CREATE TASK</button>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
    
}
export default CreateNewTask