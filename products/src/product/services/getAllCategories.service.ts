import { InternalServerErrorResponse } from "@src/commons/patterns"
import { getAllCategoriesByTenantId } from "../dao/getAllCategoriesByTenantId.dao";

export const getAllCategoriesService = async (query: { page?: number }) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server Tenant ID not found').generate();
        }

        const page = query.page || 1; // Default to page 1 if not provided
        const categories = await getAllCategoriesByTenantId(SERVER_TENANT_ID, page);

        return {
            data: {
                categories
            },
            status: 200
        };
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
};