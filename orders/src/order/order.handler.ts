import { Request, Response } from "express";
import * as Service from "./services";

export const getAllOrdersHandler = async (req: Request, res: Response) => {
    const { user } = req.body;
    const rawPage = req.query.page;
    const rawPageSize = req.query.pageSize;

    const page = rawPage ? Number(rawPage) : 1;
    const pageSize = rawPageSize ? Number(rawPageSize) : 10;

    try {
        const response = await Service.getAllOrdersService(user, { page, pageSize });
        return res.status(response.status).send(response.data);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

export const getOrderDetailHandler = async (req: Request, res: Response) => {
    const { user } = req.body;
    const { orderId } = req.params;
    const response = await Service.getOrderDetailService(user, orderId);
    return res.status(response.status).send(response.data);
}

export const placeOrderHandler = async (req: Request, res: Response) => {
    const { user } = req.body;
    const { shipping_provider } = req.body;
    const response = await Service.placeOrderService(user, shipping_provider);
    return res.status(response.status).send(response.data);
}

export const payOrderHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { payment_method, payment_reference, amount } = req.body;
    const response = await Service.payOrderService(orderId, payment_method, payment_reference, amount);
    return res.status(response.status).send(response.data);
}

export const cancelOrderHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { user } = req.body;
    const response = await Service.cancelOrderService(user, orderId);
    return res.status(response.status).send(response.data);
}
