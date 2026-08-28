function InfoCard({label,value,color}){
    return(
        <div className="flex items-center gap-3">
            <div className={`w-3 h-3 md:h-6 shrink-0 rounded-full ${color}`}/>
            <p className="m-0 self-center text-xs md:text-[14px] text-gray-500">
                <span className="text-sm md:text-[15px] text-black font-semibold">{value}</span>{" "}{label}
            </p>          
        </div>      
    )
}
export default InfoCard