import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns";
import { updateWishlistById } from "../dao/updateWishlistById.dao";
import { getWishlistById } from "../dao/getWishlistById.dao";
import logger from "../../commons/logger";

export const updateWishlistServiceV2 = async (
    id: string,
    name?: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Server tenant ID is missing');
            return new InternalServerErrorResponse('Server tenant ID is missing').generate();
        }

        const isWishlistExist = await getWishlistById(SERVER_TENANT_ID, id);
        if (!isWishlistExist) {
            logger.warn(`Wishlist not found: id=${id}, tenant=${SERVER_TENANT_ID}`);
            return new NotFoundResponse('Wishlist not found').generate();
        }

        const wishlist = await updateWishlistById(SERVER_TENANT_ID, id, {
            name
        });

        return {
            data: wishlist,
            status: 200,
        }
    } catch (err: any) {
        logger.error({ err }, 'Failed to update wishlist');
        return new InternalServerErrorResponse(err).generate();
    }
}