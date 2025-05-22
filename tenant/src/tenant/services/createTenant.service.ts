import { InternalServerErrorResponse } from "@src/commons/patterns"
import { createNewTenant } from "../dao/createNewTenant.dao";
import logger from "../../commons/logger";

export const createTenantService = async (
    owner_id: string,
    name: string,
) => {
    try {
        const tenant = await createNewTenant(owner_id, name);
        if (!tenant) {
            logger.error(`Failed to create tenant for owner_id: ${owner_id}, name: ${name}`);
            return new InternalServerErrorResponse('Error creating tenant').generate()
        }

        return {
            data: tenant,
            status: 201,
        }
    } catch (err: any) {
        logger.error({ err }, `Exception while creating tenant for owner_id: ${owner_id}, name: ${name}`);
        return new InternalServerErrorResponse(err).generate()
    }
}