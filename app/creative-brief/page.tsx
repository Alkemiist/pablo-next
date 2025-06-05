'use client';

// imports
import TextareaAutosize from 'react-textarea-autosize';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GenBriefSchema, genBriefSchema } from '@/lib/genBriefSchema';
import { z } from 'zod';
import axios from 'axios';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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

            {/* Exit Button */}
            <AlertDialog>
                <AlertDialogTrigger>
                    <X className='w-10 h-10 absolute top-8 right-8 text-slate-500 hover:text-white transition-all duration-300 cursor-pointer bg-slate-900 rounded-lg p-2 border border-slate-800 hover:bg-slate-800' />
                </AlertDialogTrigger>
                <AlertDialogContent className='bg-slate-950 border border-slate-700'>
                    <AlertDialogHeader className='flex flex-col mb-4'>
                        <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
                        <AlertDialogDescription className='text-slate-500'>
                            This action cannot be undone. This will permanently delete your brief
                            and you will have to start over.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='bg-slate-950 border border-slate-700 text-white hover:bg-slate-800 transition-all duration-300 cursor-pointer'>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='bg-indigo-700 text-white hover:bg-indigo-800 transition-all duration-300 cursor-pointer'>Delete Brief</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Title Section */}
            <div className='flex flex-col gap-2 items-center justify-center'>
                <div className="text-2xl font-bold text-center px-4">
                    Step 1: Describe your creative brief in detail
                </div>

                <p className='text-sm text-center px-4 py-4 max-w-3xl text-slate-500'>
                    This is the brief that will be used to generate the creative. Answer the questions below to create a brief.
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
                placeholder="Ex. 30s commercial for 'Chromatique'—a makeup-inspired electric car brand. Show bold color, sleek design, and self-expression. Target creative, fashion-forward drivers. " 
                className='w-full border px-4 py-4 resize-none border-slate-600 rounded-md max-w-3xl focus:border-indigo-700 focus:outline-none hover:border-indigo-700 animate-in fade-in-0 duration-300' 
                minRows={4}
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
            <div className='flex items-center justify-center gap-2 w-full max-w-3xl'>
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