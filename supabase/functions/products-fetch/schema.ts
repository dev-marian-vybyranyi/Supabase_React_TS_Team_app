import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const productsFetchSchema = z.object({
  teamId: z.string().uuid("Invalid team ID"),
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().positive().optional().default(6),
  statusFilter: z.string().optional().nullable(),
  sortOrder: z.enum(["newest", "oldest"]).optional().default("newest"),
  userFilter: z.string().uuid("Invalid user ID").optional().nullable(),
  searchQuery: z.string().optional().nullable(),
});
