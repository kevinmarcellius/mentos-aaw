import { db } from "@src/db";
import { eq, and, count } from "drizzle-orm";
import * as schema from '@db/schema/products';

type ProductFilters = {
    category_id?: string;
};

export const getProductsCountByTenantId = async (
    tenantId: string,
    filters: ProductFilters = {}
): Promise<number> => {
    const conditions = [eq(schema.products.tenant_id, tenantId)];

    if (filters.category_id) {
        conditions.push(eq(schema.products.category_id, filters.category_id));
    }

    const result = await db
        .select({ count: count() })
        .from(schema.products)
        .where(and(...conditions));

    return Number(result[0]?.count) || 0;
};