import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const CustomToolTip = ({active,payload})=>{
    if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-30 shadow-md rounded-lg p-2">
        {/* Accessing the first active dataset item */}
        <p className="text-xs font-semibold text-purple-800 mb-1">
          {payload[0].payload.priority}
        </p>
        {/* Accessing unmapped extra data hidden inside the nested payload */}
        <p className="text-sm text-gray-600">Count:{" "}
            <span className="text-sm font-medium text-gray-900">{payload[0].payload.count}</span>
        </p>
      </div>
    );
  }
  return null;
}

function DashboardBarChart({barChartData}){
     return (
        <div className="bg-white mt-6">
            <ResponsiveContainer width="100%" height="300">
                <BarChart
                data={barChartData}
                >
                <CartesianGrid stroke="none" />
                <XAxis dataKey="priority" tick={{fontSize:12,fill:"#555"}} stroke="none"/>
                <YAxis />
                <Tooltip cursor={{ fill: 'transparent' }} content={CustomToolTip} />
                {/* Using dataKey="count" and letting the fill color map from the data array */}
                <Bar 
                dataKey="count" 
                nameKey="priority"
                fill="#FF8042"
                radius={[10,10,0,0]}
                activeDot={{r:8,fill:"yellow"}}
                activeStyle={{fill:"green"}}
                />
                </BarChart>
            </ResponsiveContainer>
        </div>
  );
}
export default DashboardBarChart;