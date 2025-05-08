import { db } from "@src/db";
import { eq, and } from "drizzle-orm";
import * as schema from '@db/schema/products';

type GetProductByCategoryOptions = {
    limit?: number;
    offset?: number;
};

export const getProductByCategory = async (
    tenantId: string,
    category_id: string,
    options: GetProductByCategoryOptions = {}
) => {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;

    const result = await db
        .select()
        .from(schema.products)
        .where(
            and(
                eq(schema.products.tenant_id, tenantId),
                eq(schema.products.category_id, category_id)
            )
        )
        .limit(limit)
        .offset(offset);

    return result;
};