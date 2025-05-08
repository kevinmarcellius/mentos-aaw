import { z } from "zod";

export const getAllProductsByTenantId = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    pageSize: z.string().regex(/^\d+$/, "PageSize must be a number").optional(),
  }),
});