import express from "express";
import { AuthController } from "../controller/auth";

export const getAuthRouter = (basePath: string) => {
    const authRouter = express.Router();
    authRouter.post(`${basePath}/auth/register`, AuthController.register);
    authRouter.post(`${basePath}/auth/login`, AuthController.login);

    return authRouter;
}

