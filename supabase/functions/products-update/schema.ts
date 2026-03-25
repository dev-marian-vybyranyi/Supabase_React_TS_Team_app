import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const productsUpdateSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional().nullable(),
  removeImage: z.boolean().optional(),
});
