import { z } from "zod";

  
export const getAllCategoriesByTenantId = z.object({
    query: z.object({
      page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    }),
  });