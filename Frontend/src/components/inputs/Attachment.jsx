import { useState } from "react";
import { LuPaperclip, LuPlus, LuX } from "react-icons/lu"

function Attachment({attachments,onChange}){
    const [newAttachment,setNewAttachment] = useState("");

    const handleAddAttachment = ()=>{
        if(newAttachment.trim()){
            const updatedArr = [...attachments,newAttachment.trim()];
            onChange(updatedArr);
            setNewAttachment("");
        }
    }

    const handleDeleteAttachment = (index)=>{
        console.log("Delete btn is working");
        const updatedArr = attachments.filter((_,idx)=>idx !== index);
        onChange(updatedArr);
    }

    return (
        <div>
            {/* Show Attachment */}
            {
                attachments.map((elem,index)=>(
                    <div 
                    key={index}
                    className="flex justify-center gap-2 bg-gray-50 border border-gray-100 rounded-md px-3 py-2 mb-3 mt-2">
                        <div className="flex-1 flex items-center gap-3 border border-gray-100">
                            <LuPaperclip className="text-gray-400"/>
                            <p className="text-xs text-black">{elem}</p>
                        </div>
                        
                        {/* Delete Attachment */}
                        <button className="cursor-pointer" type="button" onClick={()=>handleDeleteAttachment(index)}>
                            <LuX className="text-lg text-gray-500"/>
                        </button>
                    </div>
                ))
            }
            {/* Add Attachment string */}
            <div className="flex items-center gap-5 mt-4">
                <div className="flex-1 flex items-center gap-3 border border-slate-500 rounded-md px-3 py-2 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20">
                    <LuPaperclip className="text-gray-400"/>
                    <input 
                    type="text"
                    value={newAttachment}
                    onChange={(e)=>setNewAttachment(e.target.value)}
                    placeholder="Add file link"
                    className="w-full text-[13px] text-black placeholder:text-gray-500 outline-none bg-white  "
                    />
                </div>
                <button type="button" className="card-btn text-nowrap" onClick={()=>handleAddAttachment()}>
                     <LuPlus className="text-lg"/>Add
                </button>
            </div>
            
        </div>
    )
}
export default Attachment