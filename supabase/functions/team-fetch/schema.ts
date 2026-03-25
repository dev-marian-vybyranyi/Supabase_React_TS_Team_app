import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const teamFetchSchema = z.object({
  teamId: z.string().uuid("Invalid team ID"),
});
