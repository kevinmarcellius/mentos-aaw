import { db } from "@src/db";
import { eq } from "drizzle-orm";
import * as schema from '@db/schema/products'
import { redisClient } from "@src/redis";

const PAGE_SIZE = 10;

export const getAllProductsByTenantId = async (tenantId: string, page: number = 1) => {
    const redisKey = `products:${tenantId}:page:${page}`;
    const cachedData = await redisClient.get(redisKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const offset = (page - 1) * PAGE_SIZE;
    const result = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.tenant_id, tenantId))
        .limit(PAGE_SIZE)
        .offset(offset);

    await redisClient.set(redisKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour
    return result;
};