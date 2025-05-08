import { db } from "@src/db";
import { eq, and, count } from "drizzle-orm";
import * as schema from "@db/schema/order"; // Corrected import path

export const getOrdersCount = async (
    tenant_id: string,
    user_id: string
) => {
    const result = await db
        .select({ count: count() }) // Use db.fn.count for counting
        .from(schema.order) // Corrected table reference
        .where(and(
            eq(schema.order.tenant_id, tenant_id),
            eq(schema.order.user_id, user_id)
        ));

    return result[0]?.count ?? 0;
};