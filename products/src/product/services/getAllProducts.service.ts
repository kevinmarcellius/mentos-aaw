import { InternalServerErrorResponse } from "@src/commons/patterns";
import { getAllProductsByTenantId } from "../dao/getAllProductsByTenantId.dao";

export const getAllProductsService = async (query: { page?: number }) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server Tenant ID not found').generate();
        }

        const page = query.page || 1; // Default to page 1 if not provided
        const products = await getAllProductsByTenantId(SERVER_TENANT_ID, page);

        return {
            data: {
                products
            },
            status: 200
        };
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
};