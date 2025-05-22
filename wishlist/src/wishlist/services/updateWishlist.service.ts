import { InternalServerErrorResponse } from "@src/commons/patterns";
import { updateWishlistById } from "../dao/updateWishlistById.dao";
import logger from "../../commons/logger";

export const updateWishlistService = async (
    id: string,
    name?: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Server tenant ID is missing');
            return new InternalServerErrorResponse('Server tenant ID is missing').generate();
        }

        const wishlist = await updateWishlistById(SERVER_TENANT_ID, id, {
            name
        })

        return {
            data: wishlist,
            status: 200,
        }
    } catch (err: any) {
        logger.error({ err }, 'Failed to update wishlist');
        return new InternalServerErrorResponse(err).generate();
    }
}