import { db } from "@src/db";
import { eq, count } from "drizzle-orm";
import * as schema from '@db/schema/categories';

export const getCategoriesCountByTenantId = async (tenantId: string): Promise<number> => {
    const result = await db
        .select({ count: count() })
        .from(schema.categories)
        .where(eq(schema.categories.tenant_id, tenantId));

    return Number(result[0]?.count) || 0;
};