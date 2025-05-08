import { db } from "@src/db";
import { eq, and } from "drizzle-orm";
import * as schema from "@db/schema/order";

type GetAllOrdersOptions = {
    limit?: number;
    offset?: number;
};

export const getAllOrders = async (
    tenant_id: string,
    user_id: string,
    options: GetAllOrdersOptions = {}
) => {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;

    return await db
        .select()
        .from(schema.order)
        .where(and(
            eq(schema.order.tenant_id, tenant_id),
            eq(schema.order.user_id, user_id)
        ))
        .limit(limit)
        .offset(offset);
};