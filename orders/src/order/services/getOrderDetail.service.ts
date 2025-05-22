import { InternalServerErrorResponse, NotFoundResponse, UnauthorizedResponse } from "@src/commons/patterns";
import { getOrderById } from "../dao/getOrderById.dao";
import { getOrderDetail } from "../dao/getOrderDetail.dao";
import { User } from "@src/types";
import logger from "../../commons/logger";

export const getOrderDetailService = async (
    user: User,
    order_id: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error("SERVER_TENANT_ID is not defined");
            throw new Error("SERVER_TENANT_ID is not defined");
        }

        if (!user.id) {
            logger.error("User ID is not defined");
            return new InternalServerErrorResponse("User ID is not defined").generate();
        }

        if (!order_id) {
            logger.error("Order ID is not defined");
            return new InternalServerErrorResponse("Order ID is not defined").generate();
        }

        const orderDetail = await getOrderDetail(SERVER_TENANT_ID, order_id);
        if (!orderDetail) {
            logger.warn(`Order detail not found for order_id: ${order_id}`);
            return new NotFoundResponse("Order detail not found").generate();
        }

        const order = await getOrderById(SERVER_TENANT_ID, user.id, orderDetail?.order_id);
        if (!order) {
            logger.warn(`Order not found for order_id: ${orderDetail?.order_id}, user_id: ${user.id}`);
            return new NotFoundResponse("Order not found").generate();
        }
        if (order.user_id !== user.id) {
            logger.warn(`Unauthorized access attempt by user_id: ${user.id} for order_id: ${orderDetail?.order_id}`);
            return new UnauthorizedResponse("User is not authorized").generate();
        }

        return {
            data: {
                ...orderDetail,
            },
            status: 200,
        }
    } catch (err: any) {
        logger.error({ err }, "Failed to get order detail");
        return new InternalServerErrorResponse(err).generate();
    }
}