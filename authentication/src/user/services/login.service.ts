import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByUsername } from '../dao/getUserByUsername.dao';
import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns"
import { User } from '@db/schema/users';
import logger from '../../commons/logger';

export const loginService = async (
    username: string,
    password: string
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            logger.error('Server tenant ID is missing');
            return new InternalServerErrorResponse("Server tenant ID is missing").generate();
        }
        const user: User = await getUserByUsername(
            username,
            SERVER_TENANT_ID,
        );
        if (!user) {
            logger.warn(`User not found: ${username}`);
            return new NotFoundResponse("User not found").generate();
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.warn(`Invalid password for user: ${username}`);
            return new NotFoundResponse("Invalid password").generate();
        }

        const payload = {
            id: user.id,
            tenant_id: user.tenant_id,
        }
        const secret: string = process.env.JWT_SECRET as string;
        const token = jwt.sign(payload, secret, {
            expiresIn: "1d",
        })

        return {
            data: {
                token,
            },
            status: 200
        }
    } catch (err: any) {
        logger.error({ err }, 'Login service error');
        return new InternalServerErrorResponse(err).generate();
    }
}