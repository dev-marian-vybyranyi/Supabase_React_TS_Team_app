import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const teamsCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  display_name: z.string().min(1, "Display name is required"),
});
