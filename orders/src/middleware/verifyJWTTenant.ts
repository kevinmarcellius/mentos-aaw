import dotenv from "dotenv";
dotenv.config();

import axios, { AxiosRequestConfig } from 'axios'
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";


interface JWTUser extends JwtPayload {
  id: string;
  tenant_id: string;
}

const customHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export const verifyAdminTokenService = async (
  token: string
) => {
  const config: AxiosRequestConfig = {
    headers: customHeaders
  };

  return await axios.post(
    `http://${process.env.AUTH_HOST}/api/auth/verify-admin-token/`, 
    { token }, 
    config
  );
};

export const verifyJWTTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const payload = await verifyAdminTokenService(token);
    if (payload.status !== 200) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const verifiedPayload = payload as {
      status: 200;
      data: {
        user: {
          id: string | null;
          username: string;
          email: string;
          full_name: string | null;
          address: string | null;
          phone_number: string | null;
        };
      };
    }

    req.body.user = verifiedPayload.data.user;
    next();
  } catch (error) {
    return res.status(401).json(
      new UnauthenticatedResponse("Invalid token").generate()
    );
  }
};
