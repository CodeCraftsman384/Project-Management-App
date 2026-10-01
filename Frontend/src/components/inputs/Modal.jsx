import { useEffect } from "react";


function Modal({children,title}){
    useEffect(() => {
        document.body.style.overflow = "hidden"; // stop the page scrolling behind
        return () => {
            document.body.style.overflow = "";
        };
    }, []);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm">
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="w-full max-w-2xl max-h-full overflow-y-auto rounded-lg bg-white shadow-xl"
        >
            <div className="border-b border-slate-200 p-4 md:p-5">
            <h3 id="modal-title" className="text-lg font-semibold text-slate-900">
                {title}
            </h3>
            </div>
            <div className="p-3 md:p-5 space-y-4">{children}</div>
        </div>
        </div>
    );
    
}
export default Modal;