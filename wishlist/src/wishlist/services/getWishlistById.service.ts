import { InternalServerErrorResponse, NotFoundResponse, UnauthorizedResponse } from "@src/commons/patterns";
import { getWishlistDetailByWishlistId } from "../dao/getWishlistDetailByWishlistId.dao";
import { getWishlistById } from "../dao/getWishlistById.dao";
import { User } from "@src/wishlist/types";
import logger from "../../commons/logger";

export const getWishlistByIdService = async (
    wishlist_id: string,
    user: User
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Server tenant ID is missing');
            return new InternalServerErrorResponse('Server tenant ID is missing').generate();
        }

        const wishlistDetail = await getWishlistDetailByWishlistId(wishlist_id);
        if (!wishlistDetail) {
            logger.warn(`Wishlist detail not found for wishlist_id: ${wishlist_id}`);
            return new NotFoundResponse('Wishlist is empty').generate();
        }

        const wishlist = await getWishlistById(SERVER_TENANT_ID, wishlist_id);
        if (!wishlist) {
            logger.warn(`Wishlist not found for wishlist_id: ${wishlist_id}`);
            return new NotFoundResponse('Wishlist not found').generate();
        }

        if (wishlist.user_id !== user.id) {
            logger.warn(`Unauthorized access by user ${user.id} to wishlist ${wishlist_id}`);
            return new UnauthorizedResponse('User is not authorized to access this wishlist').generate();
        }

        return {
            data: wishlistDetail,
            status: 200,
        };
    } catch (err: any) {
        logger.error({ err }, 'Internal server error in getWishlistByIdService');
        return new InternalServerErrorResponse(err).generate();
    }
}