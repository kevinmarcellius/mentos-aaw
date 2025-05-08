import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns";
import { getAllOrders } from "../dao/getAllOrders.dao";
import { getOrdersCount } from "../dao/getOrdersCount.dao"; // Adjusted to match the correct module path
import { redisClient } from "@src/db"; // Corrected import path
import { User } from "@src/types";

interface PaginationParams {
    page?: number;
    pageSize?: number;
}

const ALLOWED_PAGE_SIZES = [5, 10, 20];

export const getAllOrdersService = async (
    user: User,
    params: PaginationParams = {}
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Tenant ID not found').generate();
        }

        if (!user.id) {
            return new NotFoundResponse('User not found').generate();
        }

        const page = params.page && params.page > 0 ? params.page : 1;
        const pageSize = ALLOWED_PAGE_SIZES.includes(params.pageSize ?? 10) ? params.pageSize! : 10;
        const offset = (page - 1) * pageSize;

        const redisKey = `orders:${SERVER_TENANT_ID}:${user.id}:page:${page}:pageSize:${pageSize}`;

        // Check if data exists in Redis
        const cachedData = await redisClient.get(redisKey);
        if (cachedData) {
            return {
                data: JSON.parse(cachedData),
                status: 200,
            };
        }

        // Fetch data from the database
        const items = await getAllOrders(SERVER_TENANT_ID, user.id, { limit: pageSize, offset });
        const total = await getOrdersCount(SERVER_TENANT_ID, user.id);

        const responseData = {
            items,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        };

        // Store the result in Redis
        await redisClient.set(redisKey, JSON.stringify(responseData), { EX: 3600 }); // Cache for 1 hour

        return {
            data: responseData,
            status: 200,
        };
    } catch (err: any) {
        console.error("Error in getAllOrdersService:", err);
        return new InternalServerErrorResponse(err).generate();
    }
};