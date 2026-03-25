import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const createTeamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  display_name: z.string().min(1, "Display name is required"),
});

export const joinTeamSchema = z.object({
  invite_code: z.string().min(6, "Invalid invite code"),
  display_name: z.string().min(1, "Display name is required"),
});

export const fetchTeamSchema = z.object({
  teamId: z.string().uuid("Invalid team ID"),
});

export const manageTeamSchema = z.object({
  name: z.string().min(1, "Name is required"),
});
