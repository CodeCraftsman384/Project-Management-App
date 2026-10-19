import { LuCircleUser } from "react-icons/lu";

function UserCard({memberInfo}){
    return(
        <div 
            className="user-card p-2">
                <div className="flex items-center gap-3">
                    {memberInfo.profileImageUrl ? <img className="w-9 h-9 rounded-fullborder-2" src="memberInfo.profileImageUrl"/> : <LuCircleUser className="w-9 h-9"/> }
                    <div>
                        <p className="text-sm font-medium">{memberInfo.name}</p>
                        <p className="text-sm text-gray-500">{memberInfo.email}</p>
                    </div>
                </div>
                <div className="flex items-end gap-3 mt-5">
                    {/* task pending */}
                    <StatCard 
                        label="Pending" 
                        count={memberInfo?.pendingTasks || 0}
                    />
                    {/* task in progress */}
                    <StatCard
                        label="In Progress"
                        count={memberInfo?.inProgressTasks || 0}
                    />    
                    {/* task completed */}
                    <StatCard
                        label="Completed"
                        count={memberInfo?.completedTasks || 0}
                    />
                </div>
            </div>
    )
}
export default UserCard;

function StatCard({label,count}){
    const STATUS_STYLES = {
        "Pending":     "text-violet-700 bg-violet-50",
        "In Progress": "text-cyan-700 bg-cyan-50",
        "Completed":   "text-lime-700 bg-lime-50",
    };
    return(
        <div className={`flex-1 px-4 py-1.5 rounded-md whitespace-nowrap ${STATUS_STYLES[label]}`}>
            <span className="block text-base font-bold leading-tight">{count}</span>
            <span className="text-[11px] font-medium">{label}</span>
        </div>
    )
}