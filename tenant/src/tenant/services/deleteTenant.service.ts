import { InternalServerErrorResponse, NotFoundResponse, UnauthorizedResponse } from "@src/commons/patterns"
import { deleteTenantById } from "../dao/deleteTenantById.dao";
import { User } from "@src/tenant/types/user";
import { getTenantById } from "../dao/getTenantById.dao";
import logger from "../../commons/logger";

export const deleteTenantService = async (
    user: User,
    tenant_id: string
) => {
    try {
        const tenant_information = await getTenantById(tenant_id);
        if (!tenant_information) {
            logger.warn({ tenant_id }, 'Tenant not found');
            return new NotFoundResponse('Tenant not found').generate()
        }

        if (tenant_information.tenants.owner_id !== user.id) {
            logger.warn({ userId: user.id, tenant_id }, 'Unauthorized tenant delete attempt');
            return new UnauthorizedResponse('You are not allowed to delete this tenant').generate()
        }

        const tenant = await deleteTenantById(tenant_id);
        if (!tenant) {
            logger.warn({ tenant_id }, 'Tenant not found on delete');
            return new NotFoundResponse('Tenant not found').generate()
        }

        return {
            data: {
                ...tenant
            },
            status: 200,
        }
    } catch (err: any) {
        logger.error({ err, tenant_id, userId: user.id }, 'Error deleting tenant');
        return new InternalServerErrorResponse(err).generate()
    }
}