import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns";
import { getAllOrders } from "../dao/getAllOrders.dao";
import { getOrdersCount } from "../dao/getOrdersCount.dao";
import { User } from "@src/types";
import logger from "../../commons/logger"; // <-- Add this import

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
            logger.error('Tenant ID not found'); // <-- Log error
            return new InternalServerErrorResponse('Tenant ID not found').generate();
        }

        if (!user.id) {
            logger.error('User not found'); // <-- Log error
            return new NotFoundResponse('User not found').generate();
        }

        const page = params.page && params.page > 0 ? params.page : 1;
        const pageSize = ALLOWED_PAGE_SIZES.includes(params.pageSize ?? 10) ? params.pageSize! : 10;
        const offset = (page - 1) * pageSize;

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

        return {
            data: responseData,
            status: 200,
        };
    } catch (err: any) {
        logger.error({ err }, "Error in getAllOrdersService"); // <-- Log error
        return new InternalServerErrorResponse(err).generate();
    }
};