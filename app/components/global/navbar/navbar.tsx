'use client';

// imports
import { Home, User, Settings, Files, ArrowRight, ArrowLeft, NotebookPen, Component, Barcode, Brain, Briefcase, Layers, Atom, Search, Lightbulb, LayoutDashboard, FileStack, HousePlug, HouseWifi, Store, Video, Share2, Sparkles, Pencil, Database, Zap} from 'lucide-react';
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
        { href: '/', label: 'Home', icon: <Home size={20} /> }, // home page
        { href: '/variables', label: 'Variables', icon: <Database size={20} /> }, // variables page
        // { href: '/streamlined-brief', label: 'AI Brief Generator', icon: <Files size={20} /> }, // new streamlined brief flow
        { href: '/pitch-brief', label: 'Pitch Brief', icon: <Pencil size={20} /> }, // pitch brief page
        { href: '/test-pitch', label: 'Test Pitch', icon: <Zap size={20} /> }, // test pitch feature
        { href: '/marketplace', label: 'Marketplace', icon: <Store size={20} /> }, // marketplace page
        // { href: '/home-2', label: 'Home 2', icon: <Home size={20} /> }, // home page 2
        // { href: '/home-3', label: 'Home 3', icon: <HousePlug size={20} /> },
        // { href: '/social-generator', label: 'Social Generator', icon: <Share2 size={20} /> }, // social post generator
        // { href: '/brief-builder', label: 'Brief Builder (Legacy)', icon: <NotebookPen size={20} /> }, // old brief builder page
        // { href: '/analysis', label: 'Analysis', icon: <User size={20} /> },
        // { href: '/gen-brief', label: 'Brief', icon: <NotebookPen size={20} /> },
        // { href: '/brand-creation', label: 'Brand', icon: <Component size={20} /> },
        // { href: '/product-creation', label: 'Products', icon: <Barcode size={20} /> },
        // { href: '/intelligence', label: 'Intelligence', icon: <Brain size={20} /> },
        // { href: '/creative-brief', label: 'Creative Brief', icon: <Briefcase size={20} /> },
        // { href: '/god-flow', label: 'God Flow', icon: <Atom size={20} /> },
        // { href: '/profile-analysis', label: 'Profile Analysis', icon: <Search size={20} /> }, // profile analysis page
        // { href: '/inspo', label: 'Inspo', icon: <Lightbulb size={20} /> }, // inspo page   
        // { href: '/tactics', label: 'Tactics', icon: <Sparkles size={20} /> }, // tactics page
        // { href: '/persona', label: 'Persona Creation', icon: <User size={20} /> }
        // { href: '/variant-engine', label: 'Variant Engine', icon: <FileStack size={20} /> }, // variant engine page
    ];

    // the return statement
    return (
        <div className="border-r border-neutral-800 fixed top-0 left-0 h-screen z-50 shadow-md bg-neutral-950 text-white flex flex-col justify-center pt-12 gap-8 px-4 w-20">
            
            {navItems.map((item) => (
                <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-2 rounded-xl transition-colors w-full ${pathname === item.href ? 'font-bold' : ''}`}
                >
                {pathname === item.href ? 
                    <div className="neon-icon-active">{item.icon}</div> : 
                    <div className="neon-icon">{item.icon}</div>
                }
                {isOpen && <span className="text-sm">{item.label}</span>}
                </Link>
            ))}

    </div>
    )
}