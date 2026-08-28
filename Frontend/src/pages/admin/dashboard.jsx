import { useContext, useEffect, useState } from "react";
import useUserAuth from "../../hooks/UseUserAuth"
import DashboardLayout from "../layout/DashboardLayout"
import { AuthContext } from "../../Context/UserContext";
import axiosInstance from "../../utils/axiosHelper";
import { TASKS } from "../../utils/apiPaths";
import dayjs from "dayjs";
import { addThousandSeperators } from "../../utils/helper";
import InfoCard from '../../components/InfoCard'
import DashboardPieChart from "../../components/charts/DashboardPieChart";
import RecentTasks from "../../components/RecentTasks";
import DashboardBarChart from "../../components/charts/DashboardBarChart";

function Dashboard(){
    useUserAuth()
    
    
    const {user} = useContext(AuthContext);
    // console.log(user);
    const [dashboardData,setDashboardData] = useState(null);
    const [pieChartData,setPieChartData] = useState([]);
    const [barChartData,setBarChartData] = useState([]);
    const prepareData = (data)=>{
        // [{},{},{}]
        console.log(data);
        const taskStatusDistribution = [
            {status : "Pending",count : data.taskStatusDistribution.Pending},
            {status : "In Progress",count : data.taskStatusDistribution.Inprogress},
            {status : "Completed",count : data.taskStatusDistribution.Completed}
        ]
        setPieChartData(taskStatusDistribution);
        const taskPriorityDistribution = [
            {priority : "High",count : data.taskPriorityDistribution.High, fill : "red"},
            {priority : "Medium",count : data.taskPriorityDistribution.Medium, fill : "orange"},
            {priority : "Low",count : data.taskPriorityDistribution.Low, fill : "green"}
        ]
        setBarChartData(taskPriorityDistribution);
    }
    const COLORS = ["#8D51FF","#00B8DB","#7BCE00"];
    useEffect(()=>{
        const fetchDashboardData = async()=>{
            try{
                const response = await axiosInstance.get(TASKS.adminTasks);
                console.log(response);
                if(response.data){
                    setDashboardData(response.data);
                    
                    prepareData(response.data.charts);
                }
                
            }catch(e){
                console.log(e);
            }
        }
        fetchDashboardData();
    },[])
    return <>
        <DashboardLayout activeMenu="Dashboard">
            <div className="card my-5">
                <div>
                    <div className="col-span-3">
                        <h2 className="text-xl md:text-2xl">Hello {user?.name}!</h2>
                        <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">{dayjs().format("dddd DD MMMM YYYY")}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
                    <InfoCard
                        label = "Total Tasks"
                        value = {addThousandSeperators(dashboardData?.charts.taskStatusDistribution.All)}
                        color = "bg-primary"
                    />
                    <InfoCard
                        label = "Pending Tasks"
                        value = {addThousandSeperators(dashboardData?.charts.taskStatusDistribution.Pending)}
                        color = "bg-violet-500"
                    />
                    <InfoCard
                        label = "In Progress Tasks"
                        value = {addThousandSeperators(dashboardData?.charts.taskStatusDistribution.Inprogress)}
                        color = "bg-cyan-500"
                    />
                    <InfoCard
                        label = "Completed Tasks"
                        value = {addThousandSeperators(dashboardData?.charts.taskStatusDistribution.Completed)}
                        color = "bg-lime-500"
                    /> 
                </div>
                               
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
                <div>
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <h5 className="font-medium">Task Distribution</h5>
                        </div>
                        <DashboardPieChart pieChartData={pieChartData} COLORS =  {COLORS}/>
                    </div>
                    
                </div>
                <div>
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <h5 className="font-medium">Task Priority Distribution</h5>
                        </div>                        
                        <DashboardBarChart barChartData={barChartData}/>
                    </div>
                </div>
                
                <RecentTasks data={dashboardData?.recentTasks}/>
            </div>
        
        
        </DashboardLayout>
    </>
}
export default Dashboard