import { InternalServerErrorResponse } from "@src/commons/patterns";
import { deleteCategoryById } from "../dao/deleteCategoryById.dao";
import logger from "../../commons/logger";

export const deleteCategoryService = async (
    category_id: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Server Tenant ID not found');
            return new InternalServerErrorResponse('Server Tenant ID not found').generate();
        }

        const category = await deleteCategoryById(SERVER_TENANT_ID, category_id);

        return {
            data: {
                ...category,
            },
            status: 200,
        }
    } catch (err: any) {
        logger.error({ err }, 'Failed to delete category');
        return new InternalServerErrorResponse(err).generate();
    }
}