'use client'

// imports
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { useGenBriefData } from '../context/gen-brief-context';
import { GenBriefSchema, genBriefSchema } from '@/lib/genBriefSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import React from 'react';


export default function GenBrief() {

    // Destructuring the useGenBriefData hook
    const { briefName, setBriefName, brand, setBrand, product, setProduct, targetAudience, setTargetAudience, objective, setObjective, toneAndStyle, setToneAndStyle, useCase, setUseCase, constraints, setConstraints } = useGenBriefData();

    // form + zod resolver -- destructuring the useForm hook
    const { register, reset, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<GenBriefSchema>({
        resolver: zodResolver(genBriefSchema),
        mode: 'onSubmit',
        defaultValues: { 
            briefName,
            brand,
            product,
            targetAudience,
            objective,
            toneAndStyle,
            constraints
        }
    });

    // Watch form values and update context -- this is the sync between the form and the context file
    const formValues = watch();

    React.useEffect(() => {
        setBriefName(formValues.briefName || '');
        setBrand(formValues.brand || '');
        setProduct(formValues.product || '');
        setTargetAudience(formValues.targetAudience || '');
        setObjective(formValues.objective || '');
        setToneAndStyle(formValues.toneAndStyle || '');
        setConstraints(formValues.constraints || '');
    }, [formValues]);

    // on Submit -- function to handle the form submission
    const onSubmit = async (data: GenBriefSchema) => {
        
        try {
            // Log the actual form data being submitted
            console.log('Submitting form data:', data);

            // Create a new form data object
            const genBriefData = new FormData();

            // Append data to form data object
            genBriefData.append("briefName", data.briefName);
            genBriefData.append("brand", data.brand);
            genBriefData.append("product", data.product);
            genBriefData.append("targetAudience", data.targetAudience);
            genBriefData.append("objective", data.objective);
            genBriefData.append("toneAndStyle", data.toneAndStyle);
            genBriefData.append("constraints", data.constraints);

            // Send form data to backend
            // const response = await axios.post("/api/genBrief", genBriefData);
            

            // Reset form after successful submission
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    
    // the return statement
    return (

        <div className='flex flex-col gap-4 items-center px-4 py-12 overflow-y-auto bg-slate-950'>

        <div className="flex flex-col w-full lg:w-80% max-w-3xl text-center mb-2">
            <h1 className='text-2xl font-bold mb-4'>Create Generative Brief</h1>
            <p className='text-slate-500'>
                You're creating a brief that will be used by generative AI models to produce compelling imagery. The details you provide will guide 
                the AI's visual direction, style, and content.
            </p>
        </div>

        <form 
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit)(e);
            }} 
            className='flex flex-col gap-4 justify-center items-center w-full max-w-3xl'
        >
            
            {/* Brief Name */}
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="productName" className='text-sm font-medium'>Brief Name</label>
                <input 
                    type="text" 
                    placeholder='ex. Spring 2025 Campaign' 
                    {...register('briefName')}
                    className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left'
                />
            {errors.briefName && <p className='text-red-500 text-sm'>{errors.briefName.message}</p>}

            </div>

            {/* Brand */}
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="productName" className='text-sm font-medium'>Select Brand</label>
                <input 
                    type="text" 
                    placeholder='ex. Lumen' 
                    {...register('brand')}                   
                    className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left'
                />
            {errors.brand && <p className='text-red-500 text-sm'>{errors.brand.message}</p>}
            </div>



            {/* Product */}
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="productName" className='text-sm font-medium'>Select Product</label>
                <input 
                    type="text" 
                    placeholder='ex. Halo' 
                    {...register('product')}
                    className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left'
                />
            {errors.product && <p className='text-red-500 text-sm'>{errors.product.message}</p>}
            </div>
            

            {/* Target Audience */}
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="productName" className='text-sm font-medium'>Describe Target Audience</label>
                <TextareaAutosize 
                    placeholder='ex. First-time users, Gen Z, eco-conscious consumers, B2B decision-makers, etc.' 
                    minRows={1}
                    {...register('targetAudience')}
                    className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left resize-none'
                />
            {errors.targetAudience && <p className='text-red-500 text-sm'>{errors.targetAudience.message}</p>}
            </div>
            
            
            {/* Objective */}
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="productName" className='text-sm font-medium'>Objective</label>
                <TextareaAutosize 
                    placeholder='ex. Drive conversions, build awareness, announce launch, educate users, etc.' 
                    minRows={1}
                    {...register('objective')}
                    className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left resize-none'
                />
             {errors.objective && <p className='text-red-500 text-sm'>{errors.objective.message}</p>}
            </div>
           
            
            {/* Tone & Style */}
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="productName" className='text-sm font-medium'>What is the Tone & Style of the Brief?</label>
                <TextareaAutosize 
                    placeholder='ex. Playful, bold, elegant, minimal, cinematic, humorous, etc. (write one or multiple)' 
                    minRows={1}
                    {...register('toneAndStyle')}
                    className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left resize-none'
                />
            {errors.toneAndStyle && <p className='text-red-500 text-sm'>{errors.toneAndStyle.message}</p>}
            </div>
            
            {/* Constraints */}
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="productName" className='text-sm font-medium'>Any constraints?</label>
                <TextareaAutosize 
                    placeholder='ex. No animals, no people, no text, etc.' 
                    minRows={1}
                    {...register('constraints')}
                    className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left resize-none'
                />
            {errors.constraints && <p className='text-red-500 text-sm'>{errors.constraints.message}</p>}
            </div>

            <button 
                type="submit"
                className='bg-indigo-800 text-white px-4 py-2 rounded-lg w-full mt-8 hover:bg-indigo-900 cursor-pointer' 
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Generating...' : 'Generate Brief'}
            </button>

        </form>

   </div>
    )
}