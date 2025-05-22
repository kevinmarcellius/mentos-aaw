import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns"
import { getTenantById } from "../dao/getTenantById.dao";
import logger from "../../commons/logger";

export const getTenantService = async (
    tenant_id: string
) => {
    try {
        const tenant = await getTenantById(tenant_id);
        if (!tenant) {
            logger.warn(`Tenant not found: ${tenant_id}`);
            return new NotFoundResponse('Tenant not found').generate()
        }

        return {
            data: {
                ...tenant
            },
            status: 200,
        }
    } catch (err: any) {
        logger.error({ err, tenant_id }, "Failed to get tenant");
        return new InternalServerErrorResponse(err).generate()
    }
}