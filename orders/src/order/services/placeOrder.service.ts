import { getAllCartItems } from "@src/cart/dao/getAllCartItems.dao";
import { BadRequestResponse, InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns";
import { createOrder } from "../dao/createOrder.dao";
import axios, { AxiosResponse } from "axios";
import { User, Product } from "@src/types";
import logger from "../../commons/logger";

export const placeOrderService = async (
    user: User,
    shipping_provider: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error("Server tenant id not found");
            return new InternalServerErrorResponse("Server tenant id not found").generate();
        }

        if (!['JNE', 'TIKI', 'SICEPAT', 'GOSEND', 'GRAB_EXPRESS'].includes(shipping_provider)) {
            logger.warn(`Shipping provider not found: ${shipping_provider}`);
            return new NotFoundResponse('Shipping provider not found').generate();
        }

        if (!user.id) {
            logger.error("User id not found");
            return new InternalServerErrorResponse("User id not found").generate();
        }

        // get the cart items
        const cartItems = await getAllCartItems(SERVER_TENANT_ID, user.id);

        // get the product datas
        interface CartItem {
            product_id: string;
            quantity: number;
        }

        const productIds: string[] = (cartItems as CartItem[]).map((item: CartItem) => item.product_id);
        if (productIds.length === 0) {
            logger.warn(`Cart is empty for user: ${user.id}`);
            return new BadRequestResponse('Cart is empty').generate();
        }
        const products: AxiosResponse<Product[], any> = await axios.post(`http://${process.env.PRODUCT_HOST}/api/product/many`, { productIds });
        if (products.status !== 200) {
            logger.error(`Failed to get products for productIds: ${productIds.join(", ")}`);
            return new InternalServerErrorResponse("Failed to get products").generate();
        }

        // create order
        const order = await createOrder(
            SERVER_TENANT_ID,
            user.id,
            cartItems,
            products.data,
            shipping_provider as 'JNE' | 'TIKI' | 'SICEPAT' | 'GOSEND' | 'GRAB_EXPRESS',
        );

        return {
            data: order,
            status: 201,
        }
    } catch (err: any) {
        logger.error({ err }, "Error in placeOrderService");
        return new InternalServerErrorResponse(err).generate();
    }
}