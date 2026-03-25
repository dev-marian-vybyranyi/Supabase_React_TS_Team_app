import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const teamsJoinSchema = z.object({
  invite_code: z.string().min(6, "Invalid invite code"),
  display_name: z.string().min(1, "Display name is required"),
});
