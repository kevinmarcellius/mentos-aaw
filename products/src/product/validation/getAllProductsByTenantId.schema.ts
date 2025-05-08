import { z } from "zod";

export const getAllProductsByTenantId = z.object({
    query: z.object({
      page: z.string().optional().regex(/^\d+$/, "Page must be a number"),
    }),
  });