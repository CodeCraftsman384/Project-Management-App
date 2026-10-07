function ProgressBar({progress,statusObj}){
    return(
        <div className="w-full bg-gray-200 h-1.5 rounded-full">
            <div className={`${statusObj.text} ${statusObj.bg} border ${statusObj.border} h-1.5 rounded-full`} style={{width : `${progress}%`}}></div>
        </div>
    )
}
export default ProgressBar