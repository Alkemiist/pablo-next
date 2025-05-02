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
        { label: "Search Profiles", href: "/analysis/search" },
    ];
    
    return(
        <div className="bg-slate-900 h-16 flex items-center px-6">
            
            {/* These are going to be the self analysis tab and the search tab */}
            <div className="flex gap-8">
                { analysisNav.map( item => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`${pathName === item.href ? 'bg-slate-800 font-bold' : 'hover:bg-slate-800'} flex items-center gap-3 p-2 rounded-lg transition-colors`}
                    >
                        { item.label }
                    </Link>
                )) }
            </div>

            {/* These are going to be the analysis tabs */}
            <div className="flex gap-4">
                {/* Add your analysis tabs here */}
            </div>
        </div>
    )
}