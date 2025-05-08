import { InternalServerErrorResponse } from "@src/commons/patterns";
import { getAllProductsByTenantId } from "../dao/getAllProductsByTenantId.dao";
import { getProductsCountByTenantId } from "../dao/getProductsCountByTenantId.dao";

interface PaginationParams {
    page?: number;
    pageSize?: number;
}

const ALLOWED_PAGE_SIZES = [5, 10, 20];

export const getAllProductsService = async (params: PaginationParams = {}) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server Tenant ID not found').generate();
        }

        const page = params.page && params.page > 0 ? params.page : 1;
        let pageSize = ALLOWED_PAGE_SIZES.includes(params.pageSize ?? 10) ? params.pageSize! : 10;
        const offset = (page - 1) * pageSize;

        const products = await getAllProductsByTenantId(SERVER_TENANT_ID, { limit: pageSize, offset });
        const total = await getProductsCountByTenantId(SERVER_TENANT_ID);

        return {
            data: {
                products,
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
        return new InternalServerErrorResponse(err).generate();
    }
};