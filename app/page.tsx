'use client';

// imports
import { useState } from 'react';
import Button from "./components/ui/button/button";
import Link from 'next/link';
import { useAppContext } from './context/appContext';

// this is the home component
function Home() {
    
    const { mainCharacter, characters } = useAppContext();

    // this is the state of the count
    // const [ count, setCount ] = useState(0);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="m-16 text-4xl font-bold">Hello There, Pablo.</h1>
            <Link href='/intelligence' className='bg-slate-900 text-white px-24 py-4 rounded-lg hover:bg-slate-800 transition-colors duration-300'>Intelligence</Link>
        </div>
    )
}

export default Home;