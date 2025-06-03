'use client';

// import 
import { ChevronRight } from "lucide-react";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// styles: Don't forget the hover effects
const primary = 'bg-blue-700 text-white text-sm px-4 rounded-lg flex items-center gap-2 hover:bg-blue-800 cursor-pointer';
const secondary = 'border border-slate-800 text-white px-2 py-2 rounded-lg hover:bg-slate-800 cursor-pointer';


export function ButtonStack() {

    const pathname = usePathname();
    let routeToPage = '';

    // button actions
    const primaryClick = () => {

        // button routing logic
        
    }

    const secondaryClick = () => {
        console.log('secondary button clicked');
    }

    return (
        <div className="flex justify-end gap-4">
            <Link href={routeToPage} onClick={primaryClick} className={primary}>Continue <ChevronRight /></Link>
            <button onClick={secondaryClick} className={secondary}><Ellipsis /></button>
        </div>
    )
}

