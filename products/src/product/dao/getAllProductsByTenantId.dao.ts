import { db } from "@src/db";
import { eq } from "drizzle-orm";
import * as schema from '@db/schema/products'
import { redisClient } from "@src/db";

type GetAllProductsOptions = {
    limit?: number;
    offset?: number;
};

export const getAllProductsByTenantId = async (
    tenantId: string,
    options: GetAllProductsOptions = {}
) => {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    const redisKey = `products:${tenantId}:limit:${limit}:offset:${offset}`;
    const cachedData = await redisClient.get(redisKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const result = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.tenant_id, tenantId))
        .limit(limit)
        .offset(offset);

    await redisClient.set(redisKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour
    return result;
};