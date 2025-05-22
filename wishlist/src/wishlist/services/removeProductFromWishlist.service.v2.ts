import { InternalServerErrorResponse, NotFoundResponse, UnauthorizedResponse } from "@src/commons/patterns";
import { getWishlistDetailById } from "../dao/getWishlistDetailById.dao";
import { getWishlistById } from "../dao/getWishlistById.dao";
import { removeProductFromWishlist } from "../dao/removeProductFromWishlist.dao";
import { User } from "@src/wishlist/types";
import logger from "../../commons/logger";

export const removeProductFromWishlistServiceV2 = async (
    id: string,
    user: User,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Server tenant ID is missing');
            return new InternalServerErrorResponse('Server tenant ID is missing').generate();
        }

        if (!user.id) {
            logger.error('User ID is missing');
            return new InternalServerErrorResponse('User ID is missing').generate();
        }
        
        const wishlistDetail = await getWishlistDetailById(id);
        if (!wishlistDetail) {
            logger.warn(`Wishlist detail not found for id: ${id}`);
            return new NotFoundResponse('Wishlist detail not found').generate();
        }

        const wishlist = await getWishlistById(SERVER_TENANT_ID, wishlistDetail.wishlist_id);
        if (!wishlist) {
            logger.warn(`Wishlist not found for id: ${wishlistDetail.wishlist_id}`);
            return new NotFoundResponse('Wishlist not found').generate();
        }

        if (wishlist.user_id !== user.id) {
            logger.warn(`Unauthorized remove attempt by user ${user.id} on wishlist ${wishlist.id}`);
            return new UnauthorizedResponse('User is not authorized to remove product from this wishlist').generate();
        }

        const removeWishlistDetailData = await removeProductFromWishlist(id);

        return {
            data: removeWishlistDetailData,
            status: 200,
        };
    } catch (err: any) {
        logger.error({ err }, 'Error removing product from wishlist');
        return new InternalServerErrorResponse(err).generate();
    }
}