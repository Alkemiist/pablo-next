'use client';

// this is the page for the generative brief: It will be a one-step form that will  generate a brief for idea generation for the user. It will be simple and easy to use.
// The brief will be a one-pager that will be used to generate ideas for the user.
// CTA will be a button to generate the brief.

// imports
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { useGenBriefData } from '../context/gen-brief-context';


export default function GenBrief() {

    // this is the logic
    const { briefName, setBriefName, brand, setBrand, product, setProduct, targetAudience, setTargetAudience, objective, setObjective } = useGenBriefData();

    
    // the return statement
    return (
            <div>
                <form className="flex flex-col gap-4 container max-w-3xl mx-4 items-center justify-center h-screen">
                    
                </form>
            </div>
    )
}