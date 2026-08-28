import {Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip} from 'recharts'
const CustomToolTip = ({active,payload})=>{
    if (active && payload && payload.length) {
      console.log(payload)
    return (
      <div className="bg-white border border-gray-30 shadow-md rounded-lg p-2">
        {/* Accessing the first active dataset item */}
        <p className="text-xs font-semibold text-purple-800 mb-1">
          {payload[0].payload.status}
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
const CustomLegend = ({payload})=>{
    console.log(payload);
    return (       
      <div className="flex flex-wrap justify-center gap-2 mt-4 space-x-6">
        {payload.map((entry, index) => (          
             <div key={`Legend-${index} `} className='flex items-center space-x-2'>
              <div 
              className='w-2.5 h-2.5 rounded-full'
              style={{backgroundColor : entry.color}} >                
              </div>
              <span className='text-xs text-gray-700 font-medium'>{entry.value}</span>
            </div>                  
        ))}
      </div>  
        
        
    );

}

function DashboardPieChart({pieChartData,COLORS}){
  const renderLegend = ()=>{
    const customPayload = pieChartData.map((obj,index)=>(
                {
                  value : obj.status,
                  dataKey : obj.count,
                  color : COLORS[index % COLORS.length]
                }
              ))
    return <CustomLegend payload={customPayload}/>
  }
    return (
    <div style={{ width: '100%', height: 325 }}>
      <ResponsiveContainer >
        <PieChart>
          <Pie
            data={pieChartData}
            cx="50%" // Center X coordinate
            cy="50%" // Center Y coordinate
            labelLine={false}
            // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // Shows labels on slices
            outerRadius="90%" // Radius size of the circle
            innerRadius="70%"
            // fill="#8884d8"
            dataKey="count"
            nameKey = "status"
            shape={(props) => {
                const { index, ...rest } = props;
                return (
                  <Sector 
                    {...rest} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                );
            }}
          >
          </Pie>
          <Tooltip content={CustomToolTip} />
          <Legend content={renderLegend}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
export default DashboardPieChart