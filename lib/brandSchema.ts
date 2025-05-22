import { z } from "zod";


export const brandSchema = z.object({

    brandName: z.string().min(1, "Brand name is required"),
    brandDescription: z.string().min(100, "Brand description is not long enough"),
    brandPersonality: z.string().min(50, "Brand personality is not long enough"),
    brandCategory: z.string().min(1, "Category is required"),
    websiteURL: z.string().url("Invalid URL"),
    brandImage: z.instanceof(File).optional(),
    
});

export type BrandSchema = z.infer<typeof brandSchema>;