import { useState } from "react"
import { LuCircleUser } from "react-icons/lu"

function MembersAvatar({selectedMembersAvatars,maxVisible=3}){
    
    return(
        <div className="flex items-center">
            {
                selectedMembersAvatars.slice(0,maxVisible).map((MemberProfileImg,index)=>(                   
                    MemberProfileImg !== null ? 
                    <img 
                    src={MemberProfileImg}
                    key={index}
                    alt="Member Avatar"
                    className="w-9 h-9 border-2 border-white rounded-full -ml-3 first:ml-0"   />
                    : <LuCircleUser key={index} className="w-9 h-9 -ml-3 first:ml-0"/>                   
                )
                )
                
            }            
            {selectedMembersAvatars.length > maxVisible && 
                <div className="w-9 h-9 flex justify-center items-center rounder-full bg-blue-50 border-2 border-white text-sm font-medium -ml-3">
                    +{selectedMembersAvatars-maxVisible}
                </div>
            }
            
        </div>
    )
}
export default MembersAvatar