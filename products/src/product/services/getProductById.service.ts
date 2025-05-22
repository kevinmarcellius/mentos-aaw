import { InternalServerErrorResponse } from "@src/commons/patterns"
import { getProductById } from "../dao/getProductById.dao";
import logger from "../../commons/logger";

export const getProductByIdService = async (
    id: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Server Tenant ID not found');
            return new InternalServerErrorResponse('Server Tenant ID not found').generate()
        }

        const products = await getProductById(SERVER_TENANT_ID, id)

        return {
            data: {
                ...products
            },
            status: 200
        }
    } catch (err: any) {
        logger.error({ err }, 'Failed to get product by id');
        return new InternalServerErrorResponse(err).generate()
    }
}