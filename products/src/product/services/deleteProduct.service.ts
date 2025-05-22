import { InternalServerErrorResponse } from "@src/commons/patterns"
import { deleteProductById } from "../dao/deleteProductById.dao";
import logger from "../../commons/logger";

export const deleteProductService = async (
    id: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Server Tenant ID not found');
            return new InternalServerErrorResponse('Server Tenant ID not found').generate();
        }

        const product = await deleteProductById(SERVER_TENANT_ID, id);

        return {
            data: {
                ...product,
            },
            status: 200,
        }
    } catch (err: any) {
        logger.error({ err }, 'Failed to delete product');
        return new InternalServerErrorResponse(err).generate();
    }
}