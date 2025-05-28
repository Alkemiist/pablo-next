'use client'

//imports
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandSchema, type BrandSchema } from '@/lib/brandSchema';
import { useRef, useState } from 'react';
import { X } from 'lucide-react';

export default function BrandCreation() {


    // this is the form hook that will handle the form data
    const { register, reset, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<BrandSchema>({
        resolver: zodResolver(brandSchema),
    });

    // this is the function that will handle the form submission
    const onSubmit = (data: BrandSchema) => {
        
        // create form data
        const brandData = new FormData();

        // append data to form data
        brandData.append('brandName', data.brandName);
        brandData.append('brandDescription', data.brandDescription);
        brandData.append('brandPersonality', data.brandPersonality);
        brandData.append('brandCategory', data.brandCategory);
        brandData.append('websiteURL', data.websiteURL);
        if (data.brandImage) {
            brandData.append('brandImage', data.brandImage);
        }

        // here we will send the form data to the backend
    }

    // image picker functionality
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [ fileName, setFileName ] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
        }
    };

    return (
       <div className='flex flex-col gap-4 items-center px-4 py-12 overflow-y-auto bg-slate-950'>

            {/* Title Section */}
            <div className="flex flex-col w-full lg:w-80% max-w-3xl text-center mb-2">
                <h1 className='text-2xl font-bold mb-4'>Create Brand</h1>
                <p className='text-slate-500'>
                    Set up your brand once to reuse it across the entire platform. 
                    This ensures every project, asset, and AI-generated output stays consistent with your brand's identity.
                </p>
            </div>

            <form action="" className='flex flex-col gap-4 justify-center items-center w-full max-w-3xl'>
                
                {/* Brand Name */}
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="brandName" className='text-sm font-medium'>Brand Name</label>
                    <input 
                        type="text" 
                        placeholder='ex. Lumen' 
                        {...register("brandName")}
                        className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left focus:border-indigo-700 focus:outline-none hover:border-indigo-700'
                    />
                    {errors.brandName && <p className='text-red-500 text-sm'>{errors.brandName.message}</p>}
                </div>

                {/* Brand Description */}
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="brandDescription" className='text-sm font-medium'>Brand Description</label>
                    <TextareaAutosize
                        placeholder='ex. Lumen is a wellness tech brand that helps people optimize their energy, focus, and lifestyle through 
                            personalized daily routines. We combine science-backed insights with a clean aesthetic to make health feel modern 
                            and empowering.' 
                        minRows={3}
                        {...register("brandDescription")}
                        className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left resize-none focus:border-indigo-700 focus:outline-none hover:border-indigo-700'
                    />
                    {errors.brandDescription && <p className='text-red-500 text-sm'>{errors.brandDescription.message}</p>}
                </div>

                {/* Brand Personality */}
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="brandPersonality" className='text-sm font-medium'>Brand Personality</label>
                    <TextareaAutosize
                        placeholder='ex. Bold, clear, science-driven, optimistic. We speak with confidence, avoid jargon, and 
                            aim to inspire trust without sounding too formal.' 
                        minRows={3}
                        {...register("brandPersonality")}
                        className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left resize-none focus:border-indigo-700 focus:outline-none hover:border-indigo-700'
                    />
                    {errors.brandPersonality && <p className='text-red-500 text-sm'>{errors.brandPersonality.message}</p>}
                </div>

                {/* Category */}
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="brandCategory" className='text-sm font-medium'>Category</label>
                    <input 
                        type="text" 
                        placeholder='ex. Technology, Wellness, Fashion, etc.' 
                        {...register("brandCategory")}
                        className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left focus:border-indigo-700 focus:outline-none hover:border-indigo-700'
                    />
                    {errors.brandCategory && <p className='text-red-500 text-sm'>{errors.brandCategory.message}</p>}
                </div>

                {/* Website URL */}
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="websiteURL" className='text-sm font-medium'>Website URL</label>
                    <input 
                        type="text" 
                        placeholder='ex. https://www.lumen.com' 
                        {...register("websiteURL")}
                        className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left focus:border-indigo-700 focus:outline-none hover:border-indigo-700'
                    />
                    {errors.websiteURL && <p className='text-red-500 text-sm'>{errors.websiteURL.message}</p>}
                </div>

                {/* Image Picker */}
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="brandImage" className='text-sm font-medium'>Brand Logo</label>
                    <div 
                        className='flex justify-between items-center gap-2 border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left border-dashed cursor-pointer hover:border-indigo-700 transition-all duration-300' 
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {fileName ? fileName : 'Upload Logo'}
                        <X 
                            className='w-4 h-4 stroke-slate-500 cursor-pointer' 
                            onClick={(e) => {
                                e.stopPropagation();
                                setFileName(null);
                            }} 
                        />
                    </div>

                    {/* Hidden file input */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        className='hidden' 
                    />
                </div>

                {/* Submit Button */}
                <button 
                    type='submit' 
                    className='bg-indigo-800 text-white px-4 py-2 font-medium rounded-lg w-full mt-8 hover:bg-indigo-900 cursor-pointer'
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    >
                    {isSubmitting ? "Submitting..." : "Create Brand"}
                </button>
            </form>

       </div>
    )
}