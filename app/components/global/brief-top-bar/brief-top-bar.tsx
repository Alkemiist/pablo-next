
'use client';

// imports

import { Directionals } from '../../ui/button/directionals';
import { ButtonStack } from '../../ui/button/button-stack';
import { usePathname } from 'next/navigation';


// brief pages options
const briefPages = [
    { href: '/brief/page-1', label: 'Brief Details' },
    { href: '/brief/page-2', label: 'Intent' },
    { href: '/brief/page-3', label: 'Tactics' },
    { href: '/brief/page-4', label: 'Message & Objective' },
    { href: '/brief/page-5', label: 'Tone & Style' },
    { href: '/brief/page-6', label: 'Inpiration' },
    { href: '/brief/page-7', label: 'Review' },

]


export default function BriefTopBar() {

    const pathname = usePathname();

    console.log(pathname);

    return (
       
        <div className="flex justify-between items-center w-full px-8 py-2 bg-slate-900 border-b border-slate-700">

            {/* This is the directionals ( back and forward button ) */}
            <div className="flex-1 text-left">
                <Directionals />
            </div>

            {/* This is the step component */}
            <div className="flex whitespace-nowrap flex-1 gap-4 text-center">
                { briefPages.map( page => {
                    return (
                        <h3 
                        key={page.label}
                        className={`${pathname === page.href ? 'text-white-500' : 'text-slate-500'}`}
                        >
                            { page.label }
                        </h3>
                    )
                } ) }

            </div>

            {/* This is the button stack */}
            <div className="flex-1 text-right">
                <ButtonStack />
            </div>
                
        </div>

    )
};