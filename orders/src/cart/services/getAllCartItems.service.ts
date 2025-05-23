import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns";
import { getAllCartItems } from "../dao/getAllCartItems.dao";
import { getCartItemsCount } from "../dao/getCartItemsCount.dao";
import { User } from "@src/types";
import logger from "../../commons/logger";

interface PaginationParams {
    page?: number;
    pageSize?: number;
}

const ALLOWED_PAGE_SIZES = [5, 10, 20];

export const getAllCartItemsService = async (
    user: User,
    params: PaginationParams = {}
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error("Tenant ID not found");
            return new InternalServerErrorResponse('Tenant ID not found').generate();
        }

        if (!user.id) {
            logger.warn("User not found");
            return new NotFoundResponse('User not found').generate();
        }

        const page = params.page && params.page > 0 ? params.page : 1;
        const pageSize = params.pageSize && ALLOWED_PAGE_SIZES.includes(params.pageSize) ? params.pageSize : 10;
        const offset = (page - 1) * pageSize;

        const items = await getAllCartItems(SERVER_TENANT_ID, user.id, { limit: pageSize, offset });
        const total = await getCartItemsCount(SERVER_TENANT_ID, user.id);

        return {
            data: {
                items,
                pagination: {
                    page,
                    pageSize,
                    total,
                    totalPages: Math.ceil(total / pageSize)
                }
            },
            status: 200,
        };
    } catch (err: any) {
        logger.error({ err }, "Failed to get all cart items");
        return new InternalServerErrorResponse(err).generate();
    }
};