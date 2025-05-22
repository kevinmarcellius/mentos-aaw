import { NewWishlist } from "@db/schema/wishlist";
import { InternalServerErrorResponse } from "@src/commons/patterns";
import { createWishlist } from "../dao/createWishlist.dao";
import { User } from "@src/wishlist/types";
import logger from "../../commons/logger";

export const createWishlistService = async (
    user: User,
    name: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Server tenant ID is missing'); // <-- Log error
            return new InternalServerErrorResponse('Server tenant ID is missing').generate();
        }

        if (!user.id) {
            logger.error('User ID is missing'); // <-- Log error
            return new InternalServerErrorResponse('User ID is missing').generate();
        }

        const wishlistData: NewWishlist = {
            name,
            user_id: user.id,
            tenant_id: SERVER_TENANT_ID,
        }

        const wishlist = await createWishlist(wishlistData);

        return {
            data: wishlist,
            status: 201,
        };
    } catch (err: any) {
        logger.error({ err }, 'Failed to create wishlist'); // <-- Log error
        return new InternalServerErrorResponse(err).generate();
    }
}