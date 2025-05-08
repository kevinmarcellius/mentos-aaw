import { db } from "@src/db";
import { eq, and, count } from "drizzle-orm";
import * as schema from '@db/schema/cart';

export const getCartItemsCount = async (
    tenant_id: string,
    user_id: string
): Promise<number> => {
    const result = await db
        .select({ count: count() })
        .from(schema.cart)
        .where(and(
            eq(schema.cart.tenant_id, tenant_id),
            eq(schema.cart.user_id, user_id)
        ));

    return Number(result[0]?.count) || 0;
};