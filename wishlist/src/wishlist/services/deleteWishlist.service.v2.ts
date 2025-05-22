import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns";
import { deleteWishlistById } from "../dao/deleteWishlistById.dao";
import logger from "../../commons/logger";

export const deleteWishlistServiceV2 = async(
    id: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Server tenant ID is missing');
            return new InternalServerErrorResponse('Server tenant ID is missing').generate();
        }

        const wishlist = await deleteWishlistById(SERVER_TENANT_ID, id);
        if (!wishlist) {
            logger.warn(`Wishlist not found for id: ${id}`);
            return new NotFoundResponse('Wishlist not found').generate();
        }

        return {
            data: wishlist,
            status: 200,
        };
    } catch (err: any) {
        logger.error({ err }, 'Error deleting wishlist');
        return new InternalServerErrorResponse(err).generate();
    }
}