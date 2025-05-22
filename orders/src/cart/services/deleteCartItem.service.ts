import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns";
import { User } from "@src/types";
import { deleteCartItemByProductId } from "../dao/deleteCartItemByProductId.dao";
import logger from "../../commons/logger";

export const deleteCartItemService = async (
    user: User,
    product_id: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Tenant ID not found');
            return new InternalServerErrorResponse('Tenant ID not found').generate();
        }

        if (!user.id) {
            logger.error('User not found');
            return new NotFoundResponse('User not found').generate();
        }

        const cart = await deleteCartItemByProductId(SERVER_TENANT_ID, user.id, product_id);

        return {
            data: cart,
            status: 200,
        }
    } catch (err: any) {
        logger.error({ err }, 'Failed to delete cart item');
        return new InternalServerErrorResponse(err).generate();
    }
}