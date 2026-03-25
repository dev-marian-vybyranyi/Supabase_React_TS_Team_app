import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const productsCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  teamId: z.string().uuid("Invalid team ID"),
  imageUrl: z.string().url("Invalid image URL").optional().nullable(),
});
