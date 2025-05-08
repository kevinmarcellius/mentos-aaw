import { z } from "zod";

export const getAllCartItemSchema = z.object({
    body: z.object({
        user: z.string().min(1, "User is required"),
    }),
    query: z.object({
        page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
        pageSize: z.string().regex(/^\d+$/, "PageSize must be a number").optional(),
      }),
});