'use client';

// imports
import TextareaAutosize from 'react-textarea-autosize';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GenBriefSchema, genBriefSchema } from '@/lib/genBriefSchema';
import { z } from 'zod';
import axios from 'axios';

export default function CreativeBrief() {

    // form + zod resolver
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, reset, control } = useForm<z.infer<typeof genBriefSchema>>({
        resolver: zodResolver(genBriefSchema),
        defaultValues: {
            briefName: '',
            briefDescription: '',
            outputType: ''
        }
    });

    // handle form submission
    const onSubmit = async (data: GenBriefSchema) => {
        try {
            // POST the JSON directly
            const response = await axios.post("/api/creative-brief", data);

            reset();
        } catch (error) {
            // error logic here
        }
    }

    // the return statement
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='ml-2 flex flex-col gap-4 items-center justify-center px-4 h-screen'>

            {/* Title Section */}
            <div className='flex flex-col gap-2 items-center justify-center mb-4'>
                <div className="text-2xl font-bold text-center px-4">
                    Describe your project in detail
                </div>

                <p className='text-sm text-center px-4 py-4 max-w-3xl text-slate-500'>
                    Think of this as your creative brief—what you say here guides the tone, style, and story we generate.
                </p>
            </div>

            {/* Form Title Section */}
            <div className='w-full flex flex-col gap-2 max-w-3xl'>
                <label htmlFor="creativeBriefTitle" className='text-sm font-medium'>Title of Brief</label>
                <input 
                    type="text" 
                    placeholder="Ex. Chromatique's Spring Commercial." 
                    className='w-full border px-4 py-4 resize-none border-slate-600 rounded-md max-w-3xl focus:border-indigo-700 focus:outline-none hover:border-indigo-700 animate-in fade-in-0 duration-300' 
                    {...register('briefName')}
                />
                {errors.briefName && <p className='text-red-500 text-sm'>{errors.briefName.message}</p>}
            </div>

            {/* Description Section */}
            <div className='w-full flex flex-col gap-2 max-w-3xl'>
                <label htmlFor="creativeBriefDescription" className='text-sm font-medium'>Brief Description</label>
                <TextareaAutosize 
                placeholder="Ex. 30s commercial for 'Chromatique'—a makeup-inspired electric car brand. Show bold color, sleek design, and self-expression. Target creative, fashion-forward drivers. Tone: stylish, modern, and empowering. End with a CTA to book a test drive. " 
                className='w-full border px-4 py-4 resize-none border-slate-600 rounded-md max-w-3xl focus:border-indigo-700 focus:outline-none hover:border-indigo-700 animate-in fade-in-0 duration-300' 
                minRows={5}
                maxRows={10}
                {...register('briefDescription')}
            />
            {errors.briefDescription && <p className='text-red-500 text-sm'>{errors.briefDescription.message}</p>}
            </div>

            {/* Creative Type Section */}
            <div className='w-full flex flex-col gap-2 max-w-3xl'>
                <label htmlFor="outputType" className='text-sm font-medium'>Output Type</label>
                <Controller
                    name="outputType"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className='border-slate-700 w-full rounded-lg text-left px-4 py-6 hover:border-indigo-700 cursor-pointer'>
                                <SelectValue placeholder="Select output type" />
                            </SelectTrigger>
                            <SelectContent className='bg-slate-950 border border-slate-700'>
                                <SelectItem value="image" className='bg-slate-950 hover:bg-slate-900 h-12 cursor-pointer'>Image</SelectItem>
                                <SelectItem value="text" className='bg-slate-950 hover:bg-slate-900 h-12 cursor-pointer'>Text</SelectItem>
                                <SelectItem value="video" className='bg-slate-950 hover:bg-slate-900 h-12 cursor-pointer'>Video</SelectItem>
                                <SelectItem value="hybrid" className='bg-slate-950 hover:bg-slate-900 h-12 cursor-pointer'>Image + Text</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.outputType && <p className='text-red-500 text-sm'>{errors.outputType.message}</p>}
            </div>

            {/* Exit and Continue Buttons */}   
            <div className='flex items-center justify-center gap-2 w-full max-w-3xl mt-8'>
                <Link 
                    href='/creative-brief/context-step' 
                    className='flex items-center justify-center gap-2 border border-slate-700 text-white px-4 py-2 rounded-md w-full max-w-3xl mt-8 hover:bg-red-800 transition-all duration-300 cursor-pointer'
                    >
                        Exit
                    </Link>
                <Link 
                    href='/creative-brief/context-step'
                    className='flex items-center justify-center gap-2 bg-indigo-700 text-white px-4 py-2 rounded-md w-full max-w-3xl mt-8 hover:bg-indigo-800 transition-all duration-300 cursor-pointer disabled:opacity-50'
                >
                    Continue <ArrowRight className='w-4 h-4' />
                </Link>
            </div>

        </form>
    )
}