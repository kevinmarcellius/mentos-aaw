import { db } from "@src/db";
import { eq } from "drizzle-orm";
import * as schema from '@db/schema/categories'
import { redisClient } from "@src/db";

export const getAllCategoriesByTenantId = async (tenantId: string, page: number = 1) => {
    const pageLimit = 10;
    const redisKey = `categories:${tenantId}:page:${page}`;

    // Check if data exists in Redis
    const cachedData = await redisClient.get(redisKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    // Fetch data from the database
    const offset = (page - 1) * pageLimit;
    const result = await db
        .select()
        .from(schema.categories)
        .where(eq(schema.categories.tenant_id, tenantId))
        .limit(pageLimit)
        .offset(offset);

    // Store the result in Redis
    await redisClient.set(redisKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

    return result;
};