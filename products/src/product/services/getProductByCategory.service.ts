import { InternalServerErrorResponse } from "@src/commons/patterns";
import { getProductByCategory } from "../dao/getProductByCategory.dao";
import { getProductsCountByTenantId } from "../dao/getProductsCountByTenantId.dao";

interface PaginationParams {
    page?: number;
    pageSize?: number;
}

const ALLOWED_PAGE_SIZES = [5, 10, 20];

export const getProductByCategoryService = async (
    category_id: string,
    params: PaginationParams = {}
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server Tenant ID not found').generate();
        }

        const page = params.page && params.page > 0 ? params.page : 1;
        const pageSize = ALLOWED_PAGE_SIZES.includes(params.pageSize ?? 10) ? params.pageSize! : 10;
        const offset = (page - 1) * pageSize;

        const products = await getProductByCategory(SERVER_TENANT_ID, category_id, { limit: pageSize, offset });
        const total = await getProductsCountByTenantId(SERVER_TENANT_ID, { category_id });

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