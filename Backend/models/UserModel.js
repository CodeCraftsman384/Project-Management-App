const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    profileImageUrl : {type : String, default : null},
    role : {
        type : String,
        enum : ["Member","Admin"],
        default : "Member"
    }
},{timestamps : true})

const UserModel = mongoose.model('UserModel',UserSchema);
module.exports = UserModel;