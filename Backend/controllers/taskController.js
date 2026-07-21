const TaskModel = require('../models/TaskModel');
const UserModel = require('../models/UserModel');

const checkAndSave = (req, task)=>{
    console.log(req.body)
    if(req.body.assignedTo && !Array.isArray(req.body.assignedTo)){
        return {
            success: false,
            message: "Assigned to must be an array"
        };
    }
    if(req.body.attachment && !Array.isArray(req.body.attachment)){
        return {
            success: false,
            message: "Attachment must be an array"
        };
    }

    task.title = req.body?.title || task.title,
    task.description = req.body?.description || task.description,
    task.priority = req.body?.priority || task.priority,
    task.dueDate = req.body?.dueDate || task.dueDate,
    task.status = req.body?.status || task.status,
    task.assignedTo = req.body?.assignedTo || task.assignedTo,
    task.createdBy = req.userInfo._id,
    task.todoCheckList = req.body?.todoCheckList || task.todoCheckList,
    task.progress = req.body?.progress || task.progress,
    task.attachment = req.body?.attachment || task.attachment
    return {
        success : true,
        task
    }
}
//@desc Create a new task (admin only)
//route : /api/task/createNewTask
const createTask = async(req,res)=>{
    try{
        
        let newTask = new TaskModel();
        const result = checkAndSave(req,newTask);
        if(!result.success){
            return res.status(400).json(result);
        }
        newTask = result.task;
        await newTask.save();
        res.status(200).json({
            success : true,
            message : "New Task created",
            newTask
        })
    }catch(e){
        return res.status(500).json({
            success : false,
            message : "Sever issue",
            Error : e
        })
    }
}

//@desc Update the task (admin only)
//route : /api/task/updateTask/:id
const updateTask = async(req,res)=>{
    try{
        const task = await TaskModel.findById(req.params.id);
        if(!task){
            return res.status(400).json({
                success : false,
                message : "Task not found"
            })
        }
        
        if(task.createdBy.toString() !== req.userInfo._id.toString()){
            return res.status(401).json({
                success : false,
                message : "Task can only be updated by user who created it"
            })
        }
        const result = checkAndSave(req,task);
        if(!result.success){
            return res.status(400).json(result);
        }
        await task.save();
        return res.status(200).json({
            success : true,
            message : "Task Updated successfully",
            task
        })
    }catch(e){
        return res.status(500).json({
            success : false,
            message : "Server issue",
            Error : e.message
        })
    }
}

//@desc Delete the task (admin only)
//route : /api/task/deleteTask/:id
const deleteTask = async(req,res)=>{
    try{
        const task = await TaskModel.findById(req.params.id);
        if(!task){
            return res.status(400).json({
                success : false,
                message : "Task not found"
            })
        }        
        if(task.createdBy.toString() !== req.userInfo._id.toString()){
            return res.status(401).json({
                success : false,
                message : "Task can only be deleted by user who created it"
            })
        }
        await TaskModel.deleteOne({_id : req.params.id});
        return res.status(200).json({
                success : true,
                message : "Task Deleted successfully",        
        })
    }catch(e){
        return res.status(500).json({
            success : false,
            message : "Server issue",
            Error : e.message
        })
    }  
}

//@dec update todo check list
//route : /api/task/:id/todo
const updateTaskChecklist = async(req,res)=>{
    try{
        const task = await TaskModel.findById(req.params.id).populate('todoCheckList');
        if(!task){
            return res.status(400).json({
                success : false,
                message : "Task not found"
            })
        }
        if(!task.assignedTo.includes(req.userInfo._id)){
            return res.status(400).json({
                success : false,
                message : "Not authorised to update checklist"
            })
        }

        task.todoCheckList = req.body?.todoCheckList || task.todoCheckList;
        console.log("isArray",Array.isArray(task.todoCheckList));
        //auto - update progress
        let completedItems = 0;
        task.todoCheckList.filter(item=>{
            if(item.completed){
                completedItems++;
            }
        })
        const totalItems = task.todoCheckList.length;
        task.progress = totalItems > 0 ? Math.round((completedItems/totalItems) * 100) : 0;
        // auto update status
        if(!completedItems){
            task.status = "Pending";
        }else if(completedItems<totalItems){
            task.status = "In progress";
        }else if(completedItems==totalItems){
            task.status = "Completed";
        }
        await task.save();
        return res.status(200).json({
            success : true,
            message : "Checklist updated",
            task  
        })
    }catch(e){
        return res.status(500).json({
                success : false,
                message : "Server issue",
                Error : e.message
        })
    }
}

//@dec get Tasks - Admin - all tasks, user - assigned task
//route : /api/task/getTask
const getTasks = async(req,res)=>{
    try{
        const User = await UserModel.findById(req.userInfo._id).select('-password');
        const filter = {};
        if(req.body?.status){
            filter.status = req.body.status;
        }
        let tasks = [];
        if(User.role=="Admin"){
            tasks = await TaskModel.find(...filter);  
            console.log('Admin request')      
        }
        else{
            tasks = await TaskModel.find({assignedTo : req.userInfo._id, ...filter})
        }

        tasks = tasks.map(task=>{
            const completedTodoCount =task.todoCheckList.filter(item=>item.completed==true).length;
            return {...task._doc,completedTodoCount : completedTodoCount}
        })

        const completedTasksCount = await TaskModel.countDocuments({status : "Completed",
            ...(User.role !=="Admin" && {assignedTo : req.userInfo._id})
        });
        const pendingTasksCount = await TaskModel.countDocuments({status : "Pending",
            ...(User.role !=="Admin" && {assignedTo : req.userInfo._id})
        });
        const inProgressTasksCount = await TaskModel.countDocuments({status : "In progress",
            ...(User.role !=="Admin" && {assignedTo : req.userInfo._id})
        });
        return res.status(200).json({
            success : true,
            message : "All the tasks",
            tasks,
            completedTasksCount,
            pendingTasksCount,
            inProgressTasksCount
        })
    }catch(e){
        return res.status(500).json({
            success : false,
            message : "Server issue",
            Error : e.message
        })
    }
}

//@dec get Tasks by ID
//route : /api/task/getTask/:id
const getTaskById = async(req,res)=>{
    try{
        const task = await TaskModel.findById(req.params.id);
        if(!task){
                return res.status(400).json({
                    success : false,
                    message : "Task not found"
                })
        }
        const User = await UserModel.findById(req.userInfo._id).select('-password');
        if(User.role === "Member" && !task.assignedTo.includes(req.userInfo._id)){
            return res.status(400).json({
                    success : false,
                    message : "Not authorised to access task"
            })
        }
        return res.status(200).json({
                success : true,
                message : "Task found",
                task
        })
    }catch(e){
        return res.status(500).json({
                success : false,
                message : "Server issue",
                Error : e.message
            })
    }
}

//@dec get Dashboard Data (admin only)
//route : /api/task/getDashboardData
const getDashboardData = async(req,res)=>{
    try{
        //total tasks
        const totalTasks = await TaskModel.countDocuments({});
        //pending tasks
        const pendingTasks = await TaskModel.countDocuments({status : "Pending"});
        //completed task
        const completedTasks = await TaskModel.countDocuments({status : "Completed"});
        //overdue task
        const overdueTasks = await TaskModel.countDocuments({
            status : {
                $ne : "Completed"
            },
            dueDate : {
                $lt : new Date()
            }
        })
        //recent task (last 10)
        const recentTasks = await TaskModel.find().sort({createdAt:-1}).limit(10).select("title priority dueDate status createdAt -_id" );
        return res.status(200).json({
            success : true,
            message : "Data fetched successfully",
            statistics : {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            recentTasks : recentTasks
        })
    }catch(e){
        return res.status(500).json({
                    success : false,
                    message : "Server issue",
                    Error : e.message
                })
    }
}

//@dec get Dashboard Data for Members
//route : /api/task/getMemberDashboardData
const getMemberDashboardData = async(req,res)=>{
    try{
        //total tasks
        const totalTasks = await TaskModel.countDocuments({assignedTo : req.userInfo._id});
        //pending tasks
        const pendingTasks = await TaskModel.countDocuments({status : "Pending",assignedTo : req.userInfo._id});
        //completed task
        const completedTasks = await TaskModel.countDocuments({status : "Completed",assignedTo : req.userInfo._id});
        //overdue task
        const overdueTasks = await TaskModel.countDocuments({
            assignedTo : req.userInfo._id,
            status : {
                $ne : "Completed"
            },
            dueDate : {
                $lt : new Date()
            }
        })
        //recent task (last 10)
        const recentTasks = await TaskModel.find({assignedTo : req.userInfo._id}).sort({createdAt:-1}).limit(10).select("title priority dueDate status createdAt -_id" );
        return res.status(200).json({
            success : true,
            message : "Data fetched successfully",
            statistics : {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            recentTasks : recentTasks
        })
    }catch(e){
        return res.status(500).json({
                    success : false,
                    message : "Server issue",
                    Error : e.message
                })
    }
}
module.exports = {createTask,updateTask,deleteTask,updateTaskChecklist,getTasks,getTaskById,getDashboardData,getMemberDashboardData};
