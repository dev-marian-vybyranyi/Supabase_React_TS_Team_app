import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const teamManagementSchema = z.object({
  name: z.string().min(1, "Name is required"),
});
