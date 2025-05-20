'use client'

//imports
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandSchema, type BrandSchema } from '@/lib/brandSchema';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

export default function BrandCreation() {
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { register, reset, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<BrandSchema>({
        resolver: zodResolver(brandSchema),
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setValue('brandImage', file);
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [setValue]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        maxFiles: 1
    });

    const onSubmit = async(data: BrandSchema) => {
        console.log(data);
        reset();
        setPreview(null);
        setSelectedFile(null);
    };

    return (
       <div className='flex flex-col gap-4 justify-center items-center h-screen px-4 overflow-y-auto'>

            <div className="flex flex-col w-full lg:w-80% max-w-3xl text-center mb-4">
                <h1 className='text-2xl font-bold mb-8'>Create Brand</h1>
                <p className='text-slate-500'>
                    Set up your brand once to reuse it across the entire platform. 
                    This ensures every project, asset, and AI-generated output stays consistent with your brand’s identity.
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
                        className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left'
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
                        className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left resize-none'
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
                        className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left resize-none'
                    />
                    {errors.brandPersonality && <p className='text-red-500 text-sm'>{errors.brandPersonality.message}</p>}
                </div>
                {/* Instagram Handle */}
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="brandCategory" className='text-sm font-medium'>Category</label>
                    <input 
                        type="text" 
                        placeholder='ex. Technology, Wellness, Fashion, etc.' 
                        {...register("brandCategory")}
                        className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left'
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
                        className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left'
                    />
                    {errors.websiteURL && <p className='text-red-500 text-sm'>{errors.websiteURL.message}</p>}
                </div>
                {/* Image Picker */}
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="brandImage" className='text-sm font-medium'>Brand Image</label>
                    <div 
                        {...getRootProps()} 
                        className={`border-2 border-dashed border-slate-700 rounded-lg p-6 text-center cursor-pointer transition-colors
                            ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'hover:border-indigo-500'}`}
                        onClick={(e) => {
                            // Prevent the default click behavior
                            e.stopPropagation();
                            // Trigger the file input click
                            const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                            if (input) input.click();
                        }}
                    >
                        <input 
                            {...getInputProps()} 
                            {...register("brandImage")}
                            type="file"
                            className="hidden"
                        />
                        {preview ? (
                            <div className="flex flex-col gap-4">
                                <div className="relative w-full h-48">
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium text-slate-700">
                                        {selectedFile?.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {selectedFile?.size ? (selectedFile.size / 1024 / 1024).toFixed(2) : '0'} MB
                                    </p>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreview(null);
                                            setSelectedFile(null);
                                            setValue('brandImage', undefined);
                                        }}
                                        className="text-xs text-red-500 hover:text-red-600 mt-2"
                                    >
                                        Remove image
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-sm text-slate-500">
                                    {isDragActive ? (
                                        "Drop the image here..."
                                    ) : (
                                        "Drag and drop an image here, or click to select"
                                    )}
                                </p>
                                <p className="text-xs text-slate-400">
                                    Supports: PNG, JPG, JPEG, GIF
                                </p>
                            </div>
                        )}
                    </div>
                    {errors.brandImage && <p className='text-red-500 text-sm'>{errors.brandImage.message}</p>}
                </div>
                {/* Submit Button */}
                <button 
                    type='submit' 
                    className='bg-indigo-800 text-white px-4 py-2 font-medium rounded-lg w-full mt-8 hover:bg-indigo-900 cursor-pointer'
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
            </form>

       </div>
    )
}