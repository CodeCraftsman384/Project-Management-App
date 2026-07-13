const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


//@desc Register a new user
//route : /api/auth/signup
const registerNewUser = async(req,res)=>{
    try{
        if(req.body.email){
            return res.statuS(203).json({
                success : false,
                message : "User is already registered"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);

        const newUser  =new UserModel({
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword,
            profileImageUrl : req.body.profileImageUrl,
            role : req.body.role
        });
        await newUser.save();
        return res.status(200).json({
            success : true,
            message : "User registered successfully",
            newUser
        })
    }catch(e){
        console.log("Error -> ",e);
        return res.status(500).json({
            success : false,
            message : "Something went wrong"
        })
    }
}

const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    const user = await UserModel.findOne({email : email});
    if(!user){
        return res.statuS(201).json({
                success : false,
                message : "User is not registered, kindly sign up"
        })
    }
    const result = await bcrypt.compare(password,user.password);
    if(!result){
        return res.statuS(201).json({
                success : false,
                message : "Password is incorrect"
        })
    }
    //result is true
    const token = jwt.sign({
        _id : user._id
    },process.env.JWT_SECRET_KEY,{expiresIn : "3d"});
    return res.status(200).json({
            success : true,
            message : "Logged in",
            token : token
    })
}

const getUserDetails = async(req,res)=>{
    try{
        const User = await UserModel.findById(req.userInfo._id).select('-password');
        if(!User){
            res.status(401).json({
                success : false,
                message : "User not found"
            })
        }
        return res.status(200).json({
            success : true,
            message : "User found",
            User
        })
    }catch(e){
        console.log("Error -> ",e);
        return res.status(500).json({
            success : false,
            message : "Something went wrong"
        })
    }
}

const changeUserInfo = async(req,res)=>{
    try{
        const User = await UserModel.findById(req.userInfo._id).select('-password');
        if(!User){
            res.status(401).json({
                success : false,
                message : "User not found"
            })
        }
        User.name = req.body.name || User.name;
        User.email = req.body.email || User.email;
        User.profileImageUrl = req.body.profileImageUrl || User.profileImageUrl;
        await User.save();
    }catch(e){
        console.log("Error -> ",e);
        return res.status(500).json({
            success : false,
            message : "Something went wrong"
        })
    }
};
module.exports = {registerNewUser,loginUser};