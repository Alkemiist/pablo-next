//imports
import { useForm } from 'react-hook-form';



export default function BrandCreation() {
    return (
       <div className='flex flex-col gap-4 justify-center items-center border h-screen'>
        <form action="" className='flex flex-col gap-4 justify-center items-center md:w-1/2 w-full max-w-3xl'>

            <input 
                type="text" 
                placeholder='Brand Name' 
                className='border-2 border-gray-300 rounded-md p-2 w-full'
            />
            <textarea
                placeholder='Brand Description' 
                className='border-2 border-gray-300 rounded-md p-2 w-full'
            />
            <input 
                type="social handle" 
                placeholder='Brand Name' 
                className='border-2 border-gray-300 rounded-md p-2 w-full'
            />
            <textarea
                placeholder='Brand Personality' 
                className='border-2 border-gray-300 rounded-md p-2 w-full'
            />
            <textarea
                placeholder='Brand Dos and Donts' 
                className='border-2 border-gray-300 rounded-md p-2 w-full'
            />

        </form>
       </div>
    )
}