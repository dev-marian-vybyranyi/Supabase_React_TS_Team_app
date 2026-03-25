import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const productsUpdateStatusSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  status: z.string().min(1, "Status is required"),
});
