import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const createProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  teamId: z.string().uuid("Invalid team ID"),
  imageUrl: z.string().url("Invalid image URL").optional().nullable(),
});

export const fetchProductsSchema = z.object({
  teamId: z.string().uuid("Invalid team ID"),
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().positive().optional().default(6),
  statusFilter: z.string().optional().nullable(),
  sortOrder: z.enum(["newest", "oldest"]).optional().default("newest"),
  userFilter: z.string().uuid("Invalid user ID").optional().nullable(),
  searchQuery: z.string().optional().nullable(),
});

export const updateProductSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional().nullable(),
  removeImage: z.boolean().optional(),
});

export const updateProductStatusSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  status: z.string().min(1, "Status is required"),
});
