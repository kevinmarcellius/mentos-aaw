import { InternalServerErrorResponse } from "@src/commons/patterns";
import { getManyProductDatasById } from "../dao/getManyProductDatasById.dao";
import logger from "../../commons/logger";

export const getManyProductDatasByIdService = async (
    productIds: string[],
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Server Tenant ID not found');
            return new InternalServerErrorResponse('Server Tenant ID not found').generate();
        }

        const products = await getManyProductDatasById(SERVER_TENANT_ID, productIds);

        return {
            data: products,
            status: 200,
        };
    } catch (err: any) {
        logger.error({ err }, 'Failed to get many product datas by id');
        return new InternalServerErrorResponse(err).generate();
    }
}