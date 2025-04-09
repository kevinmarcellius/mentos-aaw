import { z } from "zod";

export const editTenantSchema = z.object({
    params: z.object({
        old_tenant_id: z.string().uuid(),
    }),
    body: z.object({
        tenant_id: z.string().uuid(),
        owner_id: z.string().uuid(),
        name: z.string()
    })
})