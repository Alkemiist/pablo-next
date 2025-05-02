
// import 
import { ChevronRight } from "lucide-react";
import { Ellipsis } from "lucide-react";

// styles: Don't forget the hover effects
const primary = 'bg-blue-700 text-white text-sm px-4 rounded-lg flex items-center gap-2 hover:bg-blue-800 cursor-pointer';
const secondary = 'border border-slate-800 text-white px-2 py-2 rounded-lg hover:bg-slate-800 cursor-pointer';

export function ButtonStack() {
    return (
        <div className="flex justify-end gap-4">
            <button className={primary}>Continue <ChevronRight /></button>
            <button className={secondary}><Ellipsis /></button>
        </div>
    )
}