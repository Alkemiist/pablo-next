import { z } from 'zod';

export const genBriefSchema = z.object({

    // page 1
    briefName: z.string().min(1, { message: "Brief name is required" }),
    briefDescription: z.string().min(1, { message: "Brief description is required" }),
    outputType: z.string().min(1, { message: "Output type is required" }),

    // page 2
    brand: z.string().min(1, { message: "Brand name is required" }),
    product: z.string().min(1, { message: "Product name is required" }),
    targetAudience: z.string().min(1, { message: "Target audience is required" }),

    // page 3
    objective: z.string().min(1, { message: "Objective is required" }),
    toneAndStyle: z.string().min(1, { message: "Tone and style is required" }),
    constraints: z.string().min(1, { message: "Constraints are required" }),

})

export type GenBriefSchema = z.infer<typeof genBriefSchema>;