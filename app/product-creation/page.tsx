'use client'

// imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductSchema } from "@/lib/productSchema";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import axios from "axios";

// component
export default function ProductCreation() {

    // form + zod resolver
    const { register, reset, handleSubmit, formState: { errors,isSubmitting }, setValue } = useForm<ProductSchema>({
        resolver: zodResolver(productSchema),
    });

    // on form submit
    const onSubmit = async(data: ProductSchema) => {

        // create form data
        const productData = new FormData();

        // append data to form data
        productData.append("productName", data.productName);
        productData.append("productDescription", data.productDescription);
        productData.append("productLink", data.productLink);
        if (data.productImage && fileName) {
            productData.append("productImage", data.productImage);
        }

        // send form data to backend
        const response = await axios.post("/api/product", productData);
        

        // reset form
        reset();
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

        <div className='flex flex-col gap-4 items-center justify-center px-4 py-12 overflow-y-auto bg-slate-950'>

            <div className="flex flex-col w-full lg:w-80% max-w-3xl text-center mb-2">
                <h1 className='text-2xl font-bold mb-4'>Create Product</h1>
                <p className='text-slate-500'>
                Set up your product once to reuse it across the entire platform. This ensures every project, asset, 
                and AI-generated output stays aligned with your product’s positioning, features, and identity
                </p>
            </div>

            <form action="" className='flex flex-col gap-4 justify-center items-center w-full max-w-3xl'>
                
                {/* Brand Name */}
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="productName" className='text-sm font-medium'>Product Name</label>
                    <input 
                        type="text" 
                        placeholder='ex. Lumen Halo' 
                        {...register("productName")}
                        className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left'
                    />
                    {errors.productName && <p className='text-red-500 text-sm'>{errors.productName.message}</p>}
                </div>

                {/* Brand Description */}
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="productDescription" className='text-sm font-medium'>Product Description</label>
                    <TextareaAutosize
                        placeholder='ex. Halo is a circular, high-efficiency lightbulb that uses 70% less energy than traditional 
                        bulbs while delivering a soft, even glow. Paired with the Halo app, you can customize brightness, schedule lighting, and monitor energy savings from your phone.' 
                        minRows={3}
                        {...register("productDescription")}
                        className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left resize-none'
                    />
                    {errors.productDescription && <p className='text-red-500 text-sm'>{errors.productDescription.message}</p>}
                </div>

                {/* Product links */}
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="productLink" className='text-sm font-medium'>Product Link</label>
                    <input 
                        type="text" 
                        placeholder='ex. https://www.lumen.com/halo' 
                        {...register("productLink")}
                        className='border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left'
                    />
                    
                    {errors.productLink && <p className='text-red-500 text-sm'>{errors.productLink.message}</p>}
                </div>

                {/* Image Picker */}
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="productImage" className='text-sm font-medium'>Product Image</label>
                    <div 
                        className='flex justify-between items-center gap-2 border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left border-dashed cursor-pointer hover:border-indigo-700 transition-all duration-300' 
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {fileName ? fileName : 'Upload Product'}
                        <X 
                            className='w-4 h-4 stroke-slate-500 cursor-pointer' 
                            onClick={(e) => {
                                setFileName(null);
                                e.stopPropagation();
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
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
            </form>

       </div>

    )
}