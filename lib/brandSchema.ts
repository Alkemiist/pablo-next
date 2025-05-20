import { z } from "zod";

export const brandSchema = z.object({
    brandName: z.string().min(1, "Brand name is required"),
    brandDescription: z.string().min(100, "Brand description is not long enough"),
    brandPersonality: z.string().min(50, "Brand personality is not long enough"),
    instagramHandle: z.string().min(1, "Instagram handle is required"),
    // brandDosAndDonts: z.string().min(1, "Brand dos and donts are required"),
});

export type BrandSchema = z.infer<typeof brandSchema>;