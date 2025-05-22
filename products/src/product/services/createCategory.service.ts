import { NewCategory } from "@db/schema/categories";
import { InternalServerErrorResponse } from "@src/commons/patterns"
import { createNewCategory } from "../dao/createNewCategory.dao";
import logger from "../../commons/logger";

export const createCategoryService = async (
    name: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Server Tenant ID not found');
            return new InternalServerErrorResponse('Server Tenant ID not found').generate()
        }

        const categoryData: NewCategory = {
            tenant_id: SERVER_TENANT_ID,
            name,
        }

        const newCategory = await createNewCategory(categoryData);

        return {
            data: {
                ...newCategory,
            },
            status: 201,
        }
    } catch (err: any) {
        logger.error({ err }, 'Failed to create category');
        return new InternalServerErrorResponse(err).generate()
    }
}