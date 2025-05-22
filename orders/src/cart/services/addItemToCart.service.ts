import { NewCart } from "@db/schema/cart";
import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns";
import { addItemToCart } from "../dao/addItemToCart.dao";
import { User } from "@src/types";
import logger from "../../commons/logger";

export const addItemToCartService = async (
    user: User,
    product_id: string,
    quantity: number,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error("Tenant ID not found");
            return new InternalServerErrorResponse('Tenant ID not found').generate();
        }

        if (!user.id) {
            logger.error("User not found");
            return new NotFoundResponse('User not found').generate();
        }

        const cartData: NewCart = {
            tenant_id: SERVER_TENANT_ID,
            user_id: user.id,
            product_id: product_id,
            quantity: quantity,
        }

        const item = await addItemToCart(cartData);

        return {
            data: {
                ...item,
            },
            status: 201,
        }
    } catch (err: any) {
        logger.error({ err }, "Failed to add item to cart");
        return new InternalServerErrorResponse(err).generate();
    }
}