import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosHelper";
import { MEMBER_DETAILS } from "../../utils/apiPaths";
import {LuCircleUser, LuUsers} from 'react-icons/lu'
import Modal from "./Modal";
import MembersAvatar from "./MembersAvatar";

function SelectMembers({selectedMembers,onChange}){
    const [members,setMembers] = useState([]);
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [tempSelectedMembers,setTempSelectedMembers] = useState([]);
    const [selectedMembersAvatars,setSelectedMembersAvatars] = useState([]);
    
    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const response = await axiosInstance.get(MEMBER_DETAILS.memberDetails);
                if(response.data){
                    console.log(response.data.mp);
                    setMembers(response.data.mp);
                }
            }catch(e){
                console.log("Error-> ",e);
            }
        }
        fetchData();        
    },[])

    const handleChange = (e,memberID)=>{
            console.log(e?.target.checked);
            console.log(tempSelectedMembers.includes(memberID));
            if(e?.target.checked){
                setTempSelectedMembers((prevMemberIDs)=>([...prevMemberIDs,memberID]))
            }else{
                setTempSelectedMembers((prevMemberIDs) => (
                    prevMemberIDs.filter(prevMemberID => prevMemberID !== memberID)
                ))
            }
    }

    const handleAssign = ()=>{
        onChange(tempSelectedMembers);
        const selectedProfiles = members.filter(member=>tempSelectedMembers.includes(member._id)).map(member=>member.profileImageUrl);
        setSelectedMembersAvatars(selectedProfiles);
        setIsModalOpen(false);
    }

    const handleCancel = ()=>{
        setTempSelectedMembers(selectedMembers);
        setIsModalOpen(false);
    }

    useEffect(()=>{
        if(selectedMembers.length===0){
            setTempSelectedMembers([]);
            setSelectedMembersAvatars([]);
        }
    },[selectedMembers])

    return(
        <div className="space-y-4 mt-3">
            <div  onClick={()=>setIsModalOpen(!isModalOpen)}>
                {selectedMembersAvatars.length!==0 && <MembersAvatar selectedMembersAvatars={selectedMembersAvatars} maxVisible={3}/>}
            </div>
            
            {
                selectedMembersAvatars.length===0 && 
                <button className="card-btn border border-slate-500" type="button" onClick={()=>setIsModalOpen(!isModalOpen)}>
                    <LuUsers className="text-sm "/>Add Members
                </button>           
            }
            {/* <div className="flex justify-between items-center">                                
            </div> */}
            
            {isModalOpen && <Modal                
                    isOpen={isModalOpen}
                    title="Assign Members"
                >
                <div className="space-y-4 h-[60vh] overflow-y-auto">
                    {
                        members.map(member=>(
                            <label key={member._id} className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2">                            
                                {member?.profileImageUrl != null ? 
                                <img src={`${member?.profileImageUrl}`} alt="Profile Image" className="w-10 h-10 rounded-full shrink-0" />
                                : <LuCircleUser className="shrink-0" size={64} /> }
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-gray-800">{member.name}</p>
                                    <p className="truncate text-[13px] text-gray-500">{member.email}</p>
                                </div>                                                                                      
                                <input 
                                    type="checkbox" 
                                    onChange={(e)=>handleChange(e,member._id)}
                                    checked={tempSelectedMembers.includes(member._id)}
                                    className="text-primary w-4 h-4 bg-gray-100 border-gray-300 shrink-0"
                                />
                            </label>                    
                        ))
                    }
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button className="card-btn" type="button" onClick={handleCancel}>Cancel</button>
                    <button className="card-btn-fill" type="button" onClick={handleAssign}>Save</button>
                </div>
                
            </Modal>
            }
        </div>
    )
}
export default SelectMembers;