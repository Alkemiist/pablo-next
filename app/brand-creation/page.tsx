'use client'

//imports
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandSchema, type BrandSchema } from '@/lib/brandSchema';



export default function BrandCreation() {


    const { register, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm<BrandSchema>({
        resolver: zodResolver(brandSchema),
    });

    const onSubmit = async(data: BrandSchema) => {
        console.log(data);
        reset();
    };

    return (
       <div className='flex flex-col gap-4 justify-center items-center h-screen px-4'>

            <div className="flex flex-col w-full lg:w-80% max-w-3xl text-center mb-8">
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
                    <label htmlFor="instagramHandle" className='text-sm font-medium'>Instagram Handle</label>
                    <input 
                        type="text" 
                        placeholder='@Lumen' 
                        {...register("instagramHandle")}
                        className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left'
                    />
                    {errors.instagramHandle && <p className='text-red-500 text-sm'>{errors.instagramHandle.message}</p>}
                </div>
                {/* Submit Button */}
                <button 
                    type='submit' 
                    className='bg-blue-700 text-white px-4 py-2 font-medium rounded-lg w-full mt-12 hover:bg-blue-800 cursor-pointer'
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
            </form>

       </div>
    )
}