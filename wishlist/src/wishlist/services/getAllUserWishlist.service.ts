import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns";
import { getAllUserWishlist } from "../dao/getAllUserWishlist.dao";
import { User } from "@src/wishlist/types";
import logger from "../../commons/logger";

export const getAllUserWishlistService = async (
    user: User
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Server tenant ID is missing');
            return new InternalServerErrorResponse('Server tenant ID is missing').generate();
        }

        if (!user.id) {
            logger.warn('User ID is missing');
            return new NotFoundResponse('User ID is missing').generate();
        }

        const wishlists = await getAllUserWishlist(SERVER_TENANT_ID, user.id);

        return {
            data: wishlists,
            status: 200,
        };
    } catch (err: any) {
        logger.error({ err }, 'Failed to get all user wishlists');
        return new InternalServerErrorResponse(err).generate();
    }
}