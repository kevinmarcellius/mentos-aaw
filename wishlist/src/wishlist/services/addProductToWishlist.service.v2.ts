import { NewWishlistDetail } from "@db/schema/wishlistDetail";
import { InternalServerErrorResponse, NotFoundResponse, UnauthorizedResponse } from "@src/commons/patterns";
import { addProductToWishlist } from "../dao/addProductToWishlist.dao";
import { getWishlistById } from "../dao/getWishlistById.dao";
import { User } from "@src/wishlist/types";
import logger from "../../commons/logger";

export const addProductToWishlistServiceV2 = async (
    wishlist_id: string,
    product_id: string,
    user: User,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error("Server tenant ID is missing");
            return new InternalServerErrorResponse('Server tenant ID is missing').generate();
        }

        if (!user.id) {
            logger.error("User ID is missing");
            return new InternalServerErrorResponse('User ID is missing').generate();
        }

        const wishlist = await getWishlistById(SERVER_TENANT_ID, wishlist_id);
        if (!wishlist) {
            logger.warn(`Wishlist not found: wishlist_id=${wishlist_id}`);
            return new NotFoundResponse('Wishlist not found').generate();
        }

        if (wishlist.user_id !== user.id) {
            logger.warn(`Unauthorized access: user_id=${user.id}, wishlist_user_id=${wishlist.user_id}`);
            return new UnauthorizedResponse('User is not authorized to add product to this wishlist').generate();
        }

        const wishlistDetailData: NewWishlistDetail = {
            product_id,
            wishlist_id,
        }

        const wishlistDetail = await addProductToWishlist(wishlistDetailData);

        return {
            data: wishlistDetail,
            status: 201,
        };
    } catch (err: any) {
        logger.error({ err }, "Failed to add product to wishlist");
        return new InternalServerErrorResponse(err).generate();
    }
}