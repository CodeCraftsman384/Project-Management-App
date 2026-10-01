
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { useState } from "react";

function DropDown({options,value,onChange,placeholder}){
  
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full mt-3">
      <button className=" px-2 py-3 flex w-full items-center justify-between rounded-lg border border-slate-500 bg-white text-sm text-black focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20" onClick={toggleDropdown} type="button">
        <span className={`truncate ${value ? "" : "text-slate-400"}`}>{value ? value : placeholder}</span>
        <span className="ml-2 shrink-0 text-slate-500">{isOpen?<LuChevronUp/>:<LuChevronDown/>}</span>
      </button>
        
      {isOpen && (
        <div className="absolute left-0 top-full z-20 max-h-60 w-full overflow-y-auto bg-white border border-slate-500 py-1 rounded-lg mt-1 shadow-lg">
          {options.map((option, index) => (
            <div 
              key={index}
              aria-selected={option===value} 
              className={`cursor-pointer px-3 py-2.5 text-sm hover:bg-slate-100 ${
                option === value ? "bg-blue-50 font-medium text-blue-700" : "text-slate-900"
              }`}
              onClick={()=>handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default DropDown