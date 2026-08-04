import { useState } from "react";
import Input from "../../components/inputs/input"
import { Link, useNavigate } from "react-router-dom";
import validateEmail from "../../utils/helper";
import axios from "axios"
import AUTH from "../../utils/apiPaths"
import axiosInstance from "../../utils/axiosHelper";

function Signup(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [name,setName] = useState("");
    const [AdminInviteToken,setAdminInviteToken] = useState("");
    const [errors,setErrors] = useState({
            name : "",
            email : "",
            password : "",
            Error : ""
        });
    const navigate = useNavigate();
    const handleSignup = async(e)=>{
        e.preventDefault();
        if(!name){
            setErrors({name : "Kindly enter a name",email : "", password : "",Error : ""});
            return
        }
        if(!validateEmail(email)){
            setErrors({name : "",email : "Kindly enter a valid email address",password : "",Error : ""});
            return;
        }

        if(!password){
            setErrors({name : "",email : "",password : "Kindly enter a valid password",Error : ""});
            return;
        }
        setErrors({name : "",email : "",password : "",Error : ""});
        //call api
        try{
            const payload = {name, email, password, AdminInviteToken};
            const response = await axiosInstance.post(AUTH.signup,payload);
            //redirect base on role
            if(response.token){
                localStorage.setItem(response.token);
            }
            if(response.role=="Admin"){
                navigate('/admin/dashboard');
            }else{
                navigate('/user/dashboard');
            }
        }catch(e){
            if(e.response && e.response.data.Error){
                setErrors({name : "",email : "",password : "",Error : e.response.data.Error})
            }
            else{
                setErrors({name : "",email : "",password : "",Error : "Something went wrong, Please try again"})
            }
        }
    }
    return(
        <div className="w-screen min-h-screen flex items-center justify-center bg-[beige] px-4 mt-4 mb-4">
            <div className="w-full max-w-md bg-white/60 border border-slate-200 rounded-xl shadow-sm px-8 py-10">
                <h2 className="text-lg font-medium text-black mb-8">Task Manager</h2>

                <h3 className="text-xl font-semibold text-black">Create Account</h3>
                <p className="text-xs text-slate-600 mt-1 mb-6">Please enter your details</p>

                <form onSubmit={handleSignup} className="space-y-1">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        label="Name"
                        placeholder="John Doe"
                        type="text"
                    />
                    {errors.name && <p className="text-red-500 text-xs pb-2">{errors.name}</p>}

                    <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email Address"
                    placeholder="John_doe@gmail.com"
                    type="text"
                />
                    {errors.email && <p className="text-red-500 text-xs pb-2">{errors.email}</p>}

                    <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    placeholder="Password"
                    type="password"
                />
                {errors.password && <p className="text-red-500 text-xs pb-2">{errors.password}</p>}

                <Input
                    value={AdminInviteToken}
                    onChange={(e) => setAdminInviteToken(e.target.value)}
                    label="Admin Invite Token"
                    placeholder="8-digit code (optional)"
                    type="text"
                />
                {errors.Error && <p className="text-red-500 text-xs pb-2">{errors.Error}</p>}

                <button type="submit" className="btn-primary mt-2">
                    Signup
                </button>

                <p className="text-[13px] text-slate-700 mt-4 text-center">
                    Already Registered,{" "}
                    <Link className="font-medium text-primary underline underline-offset-2" to="/login">
                        Login
                    </Link>
                </p>
                </form>
        </div>
    </div>
    )
}
export default Signup