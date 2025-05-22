'use client';

// imports
import { useState } from 'react';
import Button from "./components/ui/button/button";
import Link from 'next/link';
import { useAppContext } from './context/appContext';

// this is the home component
function Home() {
    
    const { mainCharacter, characters } = useAppContext();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="m-16 text-2xl font-bold">Where do you want to go today?</h1>
            <div className='flex flex-col gap-4'>
                <Link href='/intelligence' className='bg-slate-900 text-white px-24 py-4 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors duration-300'>Go to Intelligence Tab</Link>
                <Link href='/brief' className='bg-slate-900 text-white px-24 py-4 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors duration-300'>Go to Generative Brief</Link>
            </div>
        </div>
    )
}

export default Home;