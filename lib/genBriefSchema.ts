import { z } from 'zod';

export const genBriefSchema = z.object({

    briefName: z.string().min(1, { message: "Brief name is required" }),
    brand: z.string().min(1, { message: "Brand name is required" }),
    product: z.string().min(1, { message: "Product name is required" }),
    targetAudience: z.string().min(1, { message: "Target audience is required" }),
    objective: z.string().min(1, { message: "Objective is required" }),
    toneAndStyle: z.string().min(1, { message: "Tone and style is required" }),
    useCase: z.string().optional(),
    constraints: z.string().min(1, { message: "Constraints are required" }),

})

export type GenBriefSchema = z.infer<typeof genBriefSchema>;