import { InternalServerErrorResponse } from "@src/commons/patterns";
import { getAllCategoriesByTenantId } from "../dao/getAllCategoriesByTenantId.dao";
import { getCategoriesCountByTenantId } from "../dao/getCategoriesCountByTenantId.dao";
import logger from "../../commons/logger";

interface PaginationParams {
    page?: number;
    pageSize?: number;
}

const ALLOWED_PAGE_SIZES = [5, 10, 20];

export const getAllCategoriesService = async (params: PaginationParams = {}) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Server Tenant ID not found');
            return new InternalServerErrorResponse('Server Tenant ID not found').generate();
        }

        const page = params.page && params.page > 0 ? params.page : 1;
        const pageSize = params.pageSize && ALLOWED_PAGE_SIZES.includes(params.pageSize) ? params.pageSize : 10;
        const offset = (page - 1) * pageSize;

        const categories = await getAllCategoriesByTenantId(SERVER_TENANT_ID, { limit: pageSize, offset });
        const total = await getCategoriesCountByTenantId(SERVER_TENANT_ID);

        return {
            data: {
                categories,
                pagination: {
                    page,
                    pageSize,
                    total,
                    totalPages: Math.ceil(total / pageSize)
                }
            },
            status: 200
        };
    } catch (err: any) {
        logger.error({ err }, 'Failed to get all categories');
        return new InternalServerErrorResponse(err).generate();
    }
};