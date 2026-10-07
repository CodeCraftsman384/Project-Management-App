function Badge({colourArr,value}){
    const item = colourArr.find(obj=>obj.label==value);
    if(!item) return null;
    return (       
            <div className={`text-[11px] font-medium px-4 py-0.5 ${item.text} ${item.bg} border ${item.border} rounded`}>
                {value}
            </div>                              
    )   
}
export default Badge;