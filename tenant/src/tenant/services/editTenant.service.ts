import { InternalServerErrorResponse, NotFoundResponse, UnauthorizedResponse } from "@src/commons/patterns"
import { editTenantById } from "../dao/editTenantById.dao"
import { getTenantById } from "../dao/getTenantById.dao"
import { User } from "@src/tenant/types/user";
import logger from "../../commons/logger";

export const editTenantService = async (
    old_tenant_id: string,
    user: User,
    tenant_id?: string,
    owner_id?: string,
    name?: string
) => {
    try {
        const tenant_information = await getTenantById(old_tenant_id);
        if (!tenant_information) {
            logger.warn(`Tenant not found: ${old_tenant_id}`);
            return new NotFoundResponse('Tenant not found').generate()
        }

        if (tenant_information.tenants.owner_id !== user.id) {
            logger.warn(`Unauthorized edit attempt by user ${user.id} on tenant ${old_tenant_id}`);
            return new UnauthorizedResponse('You are not allowed to edit this tenant').generate()
        }

        const tenant = await editTenantById(old_tenant_id, { tenant_id, owner_id, name })
        if (!tenant) {
            logger.error(`Failed to edit tenant: ${old_tenant_id}`);
            return new InternalServerErrorResponse('Error editing tenant').generate()
        }
        
        return {
            data: tenant,
            status: 200,
        }
    } catch (err: any) {
        logger.error({ err }, `Exception while editing tenant: ${old_tenant_id}`);
        return new InternalServerErrorResponse(err).generate()
    }
}