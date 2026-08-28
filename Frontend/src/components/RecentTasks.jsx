import { LuMoveRight } from "react-icons/lu";
import { Navigate, useNavigate } from "react-router-dom";
import dayjs from "dayjs"

function RecentTasks({data}){
    const navigate = useNavigate();
    const getStatusBadgeColour = (status)=>{
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-500 border border-green-200";             
            case "In progress":
                return "bg-cyan-100 text-cyan-500 border border-cyan-200"                
            case "Pending":
                return "bg-purple-100 text-purple-500 border border-purple-200"       
            default:
                return "bg-gray-100 text-gray-500 border border-gray-200"
        }
    }
    const getPriorityBadgeColour = (priority)=>{
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-500 border border-red-200";             
            case "Medium":
                return "bg-orange-100 text-orange-500 border border-orange-200"                
            case "Low":
                return "bg-green-100 text-green-500 border border-green-200"       
            default:
                return "bg-gray-100 text-gray-500 border border-gray-200"
        }
    }
    return (        
            
                <div className="md:col-span-2">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <h5 className="text-lg">Recent Tasks</h5>
                            <button className="card-btn" onClick={()=>navigate('/admin/manage-Task')}>See More <LuMoveRight className="text-base"/></button>
                        </div>
                        <div className="hidden md:block overflow-x-auto p-0 rounded-lg mt-3">                        
                            <table className="min-w-full">
                                <thead >
                                    <tr className="text-left">
                                        <th scope="col" className="px-4 py-3 font-medium text-gray-800 text-[13px]">Task</th>
                                        <th scope="col" className="px-4 py-3 font-medium text-gray-800 text-[13px]">Priority</th>
                                        <th scope="col" className="px-4 py-3 font-medium text-gray-800 text-[13px]">Status</th>
                                        <th scope="col" className="px-4 py-3 font-medium text-gray-800 text-[13px]">Created At</th>
                                    </tr>
                                </thead>
                                <tbody className="border-t border-gray-100">
                                    {data?.map(obj=>{
                                        return (
                                            <tr className="border-t border-gray-200" key={obj._id}>
                                                <td className="my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden">{obj.title}</td>
                                                <td className="p-4"><span className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColour(obj.priority)}`}>{obj.priority}</span></td>
                                                <td className="p-4"><span className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColour(obj.status)}`}>{obj.status}</span></td>
                                                <td className="p-4 text-gray-700 text-[13px] text-nowrap md:table-cell ">{dayjs(obj.createdAt).format("DD MMM YYYY")}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                                
                            </table>
                        </div>
                        <div className="md:hidden mt-3 space-y-2">
                            {data?.map(obj => (
                                <div key={obj._id} className="rounded-lg border border-gray-200 p-3">
                                    <p className="text-gray-800 text-[13px] font-medium line-clamp-1">{obj.title}</p>
                                    <div className="flex items-center flex-wrap justify-between gap-2 mt-2">
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColour(obj.priority)}`}>{obj.priority}</span>
                                            <span className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColour(obj.status)}`}>{obj.status}</span>
                                        </div>                                            
                                        <span className="text-gray-500 text-xs whitespace-nowrap max-[374px]:w-full">
                                            {dayjs(obj.createdAt).format("DD MMM YYYY")}
                                        </span>                                        
                                    </div>
                                    
                                </div>
                            ))}
                        </div>
                    </div>
                    
                </div>
                                  
    )
}
export default RecentTasks;