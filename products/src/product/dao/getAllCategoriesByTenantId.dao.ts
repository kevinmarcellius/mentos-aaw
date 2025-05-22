import { db } from "@src/db";
import { eq } from "drizzle-orm";
import * as schema from '@db/schema/categories'
import { redisClient } from "@src/db";
import logger from "../../commons/logger";

type GetAllCategoriesOptions = {
    limit?: number;
    offset?: number;
};

export const getAllCategoriesByTenantId = async (
    tenantId: string,
    options: GetAllCategoriesOptions = {}
) => {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    const redisKey = `categories:${tenantId}:limit:${limit}:offset:${offset}`;

    // Check if data exists in Redis
    const cachedData = await redisClient.get(redisKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    logger.info({ tenantId, limit, offset }, "Cache miss for categories");

    // Fetch data from the database
    const result = await db
        .select()
        .from(schema.categories)
        .where(eq(schema.categories.tenant_id, tenantId))
        .limit(limit)
        .offset(offset);

    // Store the result in Redis
    await redisClient.set(redisKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

    return result;
};