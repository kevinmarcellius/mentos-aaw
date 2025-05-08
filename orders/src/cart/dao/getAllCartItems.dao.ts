import { db } from "@src/db";
import { eq, and } from "drizzle-orm";
import * as schema from '@db/schema/cart';

type GetAllCartItemsOptions = {
    limit?: number;
    offset?: number;
};

export const getAllCartItems = async (
    tenant_id: string,
    user_id: string,
    options: GetAllCartItemsOptions = {}
) => {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;

    // Fetch data from the database
    const result = await db
        .select()
        .from(schema.cart)
        .where(and(
            eq(schema.cart.tenant_id, tenant_id),
            eq(schema.cart.user_id, user_id)
        ))
        .limit(limit)
        .offset(offset);

    return result;
};