const mongoose = require('mongoose');

const ToDoSchema = new mongoose.Schema({
    text : {type : String},
    completed : {type : Boolean, default : false}
})

const TaskSchema = new mongoose.Schema({
    title : {type : String, required : true},
    description : String,
    priority : {
        type : String,
        enum : ["High","Medium","Low"],
        default : "Medium"
    },
    dueDate : {type : Date, required : true},
    status : {
        type : String,
        enum : ["In progress","Completed","Pending"],
        default : "Pending"
    },
    assignedTo : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'UserModel'
    }],
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'UserModel'
    },
    todoCheckList : [ToDoSchema],
    attachment : [{type : String}],
    progress : {type : Number, default : 0}
},{timestamps : true})

module.exports = mongoose.model("TaskModel",TaskSchema);