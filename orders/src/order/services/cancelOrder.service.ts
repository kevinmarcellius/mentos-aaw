import { InternalServerErrorResponse, NotFoundResponse, UnauthorizedResponse } from "@src/commons/patterns";
import { getOrderById } from "../dao/getOrderById.dao";
import { cancelOrder } from "../dao/cancelOrder.dao";
import { User } from "@src/types";
import logger from "../../commons/logger";

export const cancelOrderService = async (
    user: User,
    order_id: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error("Server tenant id not found");
            return new InternalServerErrorResponse("Server tenant id not found").generate();
        }

        if (!user.id) {
            logger.error("User id not found");
            return new NotFoundResponse("User id not found").generate();
        }

        const order = await getOrderById(SERVER_TENANT_ID, user.id, order_id);

        if (order.user_id !== user.id) {
            logger.warn(`Unauthorized cancel attempt by user ${user.id} for order ${order_id}`);
            return new UnauthorizedResponse("User not authorized to cancel this order").generate();
        }

        if (['CANCELLED', 'REFUNDED'].includes(order.order_status)) {
            logger.warn(`Order ${order_id} already cancelled or refunded`);
            return new UnauthorizedResponse("Order already cancelled").generate();
        }

        await cancelOrder(SERVER_TENANT_ID, user.id, order_id);
        order.order_status = 'CANCELLED';

        return {
            data: order,
            status: 200,
        }
    } catch (err: any) {
        logger.error({ err }, `Failed to cancel order ${order_id} for user ${user.id}`);
        return new InternalServerErrorResponse(err).generate();
    }
}