import { useState } from "react";
import AuthLayout from "../layout/AuthLayout";
import Input from "../../components/inputs/input";
import { Link, useNavigate } from 'react-router-dom';
import validateEmail from "../../utils/helper";
import axiosInstance from "../../utils/axiosHelper";
import AUTH from "../../utils/apiPaths";

function Login(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [errors,setErrors] = useState({
        email : "",
        password : "",
        Error : ""
    });
    const navigate = useNavigate();
    const handleLogin = async(e)=>{
        e.preventDefault();
        // console.log(e);

        if(!validateEmail(email)){
            setErrors({email : "Kindly enter a valid email address",password : "",Error : ""});
            return;
        }

        if(!password){
            setErrors({email : "",password : "Kindly enter a valid password",Error : ""});
            return;
        }
        setErrors({
            email : "",
            password : "",
            Error : ""
        })
        //send api call
        try{
            const payload = { email, password};
            const response = await axiosInstance.post(AUTH.login,payload);
            console.log(response);
            
            if(response.data.token){
                localStorage.setItem("token",response.data.token);
            }
            //redirect base on role
            if(response.data.role=="Admin"){
                navigate('/admin/dashboard');
            }else{
                navigate('/user/dashboard');
            }
        }catch(e){
            
            if(e.response && e.response.data.message){
                setErrors({email : "",password : "",Error : e.response.data.message})
            }
            else{
                setErrors({email : "",password : "",Error : "Something went wrong, Please try again"})
            }
        }
        
        
    }
    return (
        <div className="w-screen min-h-screen flex items-center justify-center bg-[beige] px-4 py-4">
            <div className="w-full max-w-lg bg-white/60 border border-slate-200 rounded-xl shadow-sm px-10 py-12">
                <h2 className="text-lg font-medium text-black mb-8">Task Manager</h2>
                <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">Please enter your details</p>

                <form onSubmit={handleLogin}>                                    
                    <Input
                        value={email}
                        onChange = {(e)=>{setEmail(e.target.value)}}
                        label="Email Address"
                        placeholder="John_doe@gmail.com"
                        type="text"
                    />
                    {errors.email && (<p className="text-red-500 text-xs pb-2.5">{errors.email}</p>)}
                    <Input
                        value={password}
                        onChange = {(e)=>{setPassword(e.target.value)}}
                        label="Password"
                        placeholder="Password"
                        type="password"
                    />
                    {errors.password && (<p className="text-red-500 text-xs pb-2.5">{errors.password}</p>)}

                    {errors.Error && (<p className="text-red-500 text-xs pb-2.5">{errors.Error}</p>)}
                    <button type="Submit" className="btn-primary mt-2">Login</button>
                    <p className="flex flex-wrap justify-center gap-x-1 text-[13px] text-slate-700 mt-4 text-center">Not Registered, 
                        <Link className="font-medium text-primary underline underline-offset-2" to="/signup">Signup</Link>
                    </p>
                </form>
            </div>
        </div>
        )
}
export default Login

{/* <div className="lg:w-[70]% h-3/4 md:h-full flex flex-col justify-center"> */}