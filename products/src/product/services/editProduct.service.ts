import { InternalServerErrorResponse } from "@src/commons/patterns";
import { editProductById } from "../dao/editProductById.dao";
import logger from "../../commons/logger";

export const editProductService = async (
    id: string,
    name?: string,
    description?: string,
    price?: number,
    quantity_available?: number,
    category_id?: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Server Tenant ID not found');
            return new InternalServerErrorResponse('Server Tenant ID not found').generate();
        }

        const product = await editProductById(SERVER_TENANT_ID, id, {
            name,
            description,
            price,
            quantity_available,
            category_id,
        });

        return {
            data: product,
            status: 200,
        };
    } catch (err: any) {
        logger.error({ err }, 'Failed to edit product');
        return new InternalServerErrorResponse(err).generate();
    }
}