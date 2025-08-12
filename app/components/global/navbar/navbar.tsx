'use client';

// imports
import { Home, User, Settings, ArrowRight, ArrowLeft, NotebookPen, Component, Barcode, Brain, Briefcase, Layers, Atom, Search, Lightbulb} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';


// this is the navbar component
export default function Navbar() {

    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false); 

    const handleNav = () => {
        setIsOpen(!isOpen);
    }

    // these are the nav items
    const navItems = [
        { href: '/', label: 'Home', icon: <Home size={20} /> },
        // { href: '/analysis', label: 'Analysis', icon: <User size={20} /> },
        // { href: '/gen-brief', label: 'Brief', icon: <NotebookPen size={20} /> },
        // { href: '/brand-creation', label: 'Brand', icon: <Component size={20} /> },
        // { href: '/product-creation', label: 'Products', icon: <Barcode size={20} /> },
        // { href: '/intelligence', label: 'Intelligence', icon: <Brain size={20} /> },
        { href: '/creative-brief', label: 'Creative Brief', icon: <Briefcase size={20} /> },
        // { href: '/god-flow', label: 'God Flow', icon: <Atom size={20} /> },
        { href: '/profile-analysis', label: 'Profile Analysis', icon: <Search size={20} /> },
        { href: '/inspo', label: 'Inspo', icon: <Lightbulb size={20} /> },
        { href: '/persona', label: 'Persona Creation', icon: <User size={20} /> }

    ];

    // the return statement
    return (
        <div className=" border-r border-neutral-700 fixed top-0 left-0 h-screen z-50 shadow-md bg-neutral-950 text-white flex flex-col pt-12 gap-6 px-4 transition-all duration-600 ease-in-out ${isOpen ? 'w-56' : 'w-20'}">
            {navItems.map((item) => (
                <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-2 rounded-xl transition-colors w-full ${pathname === item.href ? 'bg-neutral-800 font-bold border border-neutral-700' : 'hover:bg-neutral-800'}`}
                >
                {item.icon}
                {isOpen && <span className="text-sm">{item.label}</span>}
                </Link>
            ))}
        {/* <button onClick={handleNav} className="absolute bottom-24 left-1/2 transform -translate-x-1/2 m-full hover:bg-slate-800 rounded-lg p-2"> 
            {isOpen ? <ArrowLeft size={20} /> : <ArrowRight size={20} />} 
        </button> */}

    </div>
    )
}