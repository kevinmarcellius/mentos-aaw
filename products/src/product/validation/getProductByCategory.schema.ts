import { z } from "zod";

export const getProductByCategorySchema = z.object({
  params: z.object({
    category_id: z.string({ required_error: "Category ID is required" }).uuid(),
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    pageSize: z.string().regex(/^\d+$/, "PageSize must be a number").optional(),
  })
});
