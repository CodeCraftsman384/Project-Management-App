import { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function Input({value,onChange,label,placeholder,type}){
    const [showPassword,setShowPassword] = useState(false);
    return <div>
        <label className="text-[13px] text-slate-800" htmlFor={label}>{label}</label>
        <div className="input-box">
            <input
            value={value}
            type={type == "password" ? (showPassword ? "text" : "password"): type}  
            id={label}
            placeholder={placeholder}
            onChange={onChange}
            className="w-full bg-transparent outline-none"
            />
            {
                type=="password" && (
                    <>
                        {showPassword ? 
                        (<FaRegEyeSlash
                        size={22}
                        className="text-primary cursor-pointer"
                        onClick = {()=>setShowPassword(!showPassword)}
                        />) :
                        (<FaRegEye 
                        size={22}
                        className="text-slate-400 cursor-pointer"
                        onClick = {()=>setShowPassword(!showPassword)}
                        />)
                        }
                    </>
                )
            }
        </div>
    
    </div>
}
export default Input