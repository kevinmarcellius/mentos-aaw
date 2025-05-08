import { db } from "@src/db";
import { eq, and } from "drizzle-orm";
import * as schema from '@db/schema/cart';
import { redisClient } from "@src/db";

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
    const redisKey = `cart:${tenant_id}:${user_id}:limit:${limit}:offset:${offset}`;

    // Check if data exists in Redis
    const cachedData = await redisClient.get(redisKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

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

    // Store the result in Redis
    await redisClient.set(redisKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

    return result;
};