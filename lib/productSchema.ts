
import { z } from 'zod';

export const productSchema = z.object({

    productName: z.string().min(1, "Product name is required"),
    productDescription: z.string().min(100, "Product description is not long enough"),
    productImage: z.instanceof(File).optional(),
    productLink: z.string().url("Invalid URL"),

});

export type ProductSchema = z.infer<typeof productSchema>;