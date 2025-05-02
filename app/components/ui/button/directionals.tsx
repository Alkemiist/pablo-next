

// imports
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Directionals() {
    return (
        <div className="flex gap-4">
            <ChevronLeft className="border border-slate-800 rounded-lg w-8 h-8 p-1 hover:bg-slate-800 cursor-pointer" />
            <ChevronRight className="border border-slate-800 rounded-lg w-8 h-8 p-1 hover:bg-slate-800 cursor-pointer" />
        </div>
    )
}