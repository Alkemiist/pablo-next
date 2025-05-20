'use client';

// imports
import { Video, Camera, Image, Type, EllipsisVertical, Pencil, Trash2, Check } from 'lucide-react';
import { useState } from 'react';

export default function Card() {

    const [ isMenuOpen, setIsMenuOpen ] = useState( false );

    return (

        // This is the card div
        <div className='min-w-sm max-w-sm bg-slate-900 border border-slate-700 rounded-2xl px-4'>

            {/* This is the card header */}
            <div className="flex items-center justify-between px-4 py-4">
                <Camera className='p-2 w-9 h-9 rounded-lg border border-slate-700 stroke-slate-300 stroke-1' />
                <EllipsisVertical className='w-6 h-6 relative cursor-pointer' onClick={ () => setIsMenuOpen( !isMenuOpen ) } />
                    {
                        isMenuOpen && (
                            <div className="absolute ml-85 mt-22 flex flex-col border md:w-60 bg-slate-900 border-slate-700 text-white rounded-md shadow-lg">
                                <a href="#" className="flex items-center justify-between hover:bg-slate-800 transition-colors duration-100 px-4 py-4 cursor-pointer">Edit <Pencil className="w-4 h-4 stroke-slate-500" /></a>
                                <a href="#" className="flex items-center justify-between hover:bg-slate-800 transition-colors duration-100 px-4 py-4 cursor-pointer">Select <Check className="w-4 h-4 stroke-slate-500" /></a>
                                <a href="#" className="flex items-center justify-between hover:bg-slate-800 transition-colors duration-100 px-4 py-4 cursor-pointer text-red-500">Delete <Trash2 className="w-4 h-4 stroke-red-500" /></a>
                            </div>
                        )
                    }
            </div>

            {/* This is the card visual frame */}
            <div className='bg-slate-800 rounded-lg h-48'>
                {/* Switch logic for the card visual */}
            </div>

            {/* This is the card meta */}
            <div className='flex items-center justify-between px-4 py-6'>
                <div className='text-slate-400 text-sm font-light'>Date created:</div>
                <div className='text-white text-sm font-light'>May 20, 2025</div>
            </div>
            
        </div>
    )
}