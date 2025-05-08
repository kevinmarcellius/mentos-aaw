import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns";
import { getAllOrders } from "../dao/getAllOrders.dao";
import { getOrdersCount } from "../dao/getOrdersCount.dao"; // Adjusted to match the correct module path
import { User } from "@src/types";

interface PaginationParams {
    page?: number;
    pageSize?: number;
}

const ALLOWED_PAGE_SIZES = [5, 10, 20];

export const getAllOrdersService = async (
    user: User,
    params: PaginationParams = {}
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Tenant ID not found').generate();
        }

        if (!user.id) {
            return new NotFoundResponse('User not found').generate();
        }

        const page = params.page && params.page > 0 ? params.page : 1;
        const pageSize = ALLOWED_PAGE_SIZES.includes(params.pageSize ?? 10) ? params.pageSize! : 10;
        const offset = (page - 1) * pageSize;

    

        // Fetch data from the database
        const items = await getAllOrders(SERVER_TENANT_ID, user.id, { limit: pageSize, offset });
        const total = await getOrdersCount(SERVER_TENANT_ID, user.id);

        const responseData = {
            items,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        };


        return {
            data: responseData,
            status: 200,
        };
    } catch (err: any) {
        console.error("Error in getAllOrdersService:", err);
        return new InternalServerErrorResponse(err).generate();
    }
};