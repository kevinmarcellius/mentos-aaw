import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns";
import { updateWishlistById } from "../dao/updateWishlistById.dao";
import { getWishlistById } from "../dao/getWishlistById.dao";

export const updateWishlistServiceV2 = async (
    id: string,
    name?: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server tenant ID is missing').generate();
        }

        const isWishlistExist = await getWishlistById(SERVER_TENANT_ID, id);
        if (!isWishlistExist) {
            return new NotFoundResponse('Wishlist not found').generate();
        }

        const wishlist = await updateWishlistById(SERVER_TENANT_ID, id, {
            name
        })

        return {
            data: wishlist,
            status: 200,
        }
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
}