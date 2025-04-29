'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function TopBar() {

    const pathName = usePathname();

    console.log(pathName);

    // Nav options for the user or search 
    const analysisNav = [
        { label: "My Analysis", href: "/analysis" },
        { label: "Search Profiles", href: "/search" },
    ];
    
    return(

        <div className=" bg-slate-900 h-16 flex items-center px-6">
            
            <div className="flex gap-8">
            { analysisNav.map( item => (
                <Link
                    key={item.label}
                    href={item.href}
                    className={`${pathName === item.href ? 'bg-slate-800 font-bold' : 'hover:bg-slate-800'} flex items-center gap-3 p-2 rounded-lg transition-colors`}
                >
                    { item.label }
                </Link>
            ) ) }
            </div>

        
       
        </div>

    )
}