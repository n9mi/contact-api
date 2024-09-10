import { Request, Response, NextFunction, response } from "express";
import { LoginRequest, RegisterRequest } from "../model/auth";
import AuthService from "../service/auth";

export class AuthController {

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const registerReq: RegisterRequest = req.body as RegisterRequest;
            const registerRes = await AuthService.register(registerReq);

            res.status(200)
                .json(registerRes);
        } catch (e) {
            next(e);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const loginReq: LoginRequest = req.body as LoginRequest;
            const loginRes = await AuthService.login(loginReq);

            res.status(200)
                .json({
                    data: loginRes
                });
        } catch (e) {
            next(e);
        }
    }
}