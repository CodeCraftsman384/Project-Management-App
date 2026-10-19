import { useEffect, useState } from "react"
import DashboardLayout from "../layout/DashboardLayout"
import axiosInstance from "../../utils/axiosHelper";
import { MEMBER_DETAILS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { LuCircleUser } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import useUserAuth from "../../hooks/UseUserAuth";
function ManageMembers(){
    useUserAuth();
    const [members,setMembers] = useState([]);
    useEffect(()=>{
        const getMembers = async()=>{
            try{
                const response = await axiosInstance.get(MEMBER_DETAILS.memberDetails);
                if(response.data.success){
                    console.log(response.data);
                    setMembers(response.data.mp);
                }
            }catch(e){
                console.log("Error-> ",e);
                toast.error("Error Fetching Members");
            }
        }
        getMembers();
    },[])
    return (
    <DashboardLayout activeMenu="Team Members">
        <div className="mt-5">
            <div>
                <h2 className="text-xl font-medium">Manage Members</h2>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
                {
                    members.map((member)=>(
                        <UserCard key={member._id} memberInfo={member}/>
                    ))
                }
             </div>
        </div>
    </DashboardLayout>
    )
}
export default ManageMembers