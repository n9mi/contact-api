import { Request, Response, NextFunction } from "express";
import UserService from "../service/user";
import { UserUpdateRequest } from "../model/user";

export class UserController {

    static async info(req: Request, res: Response, next: NextFunction) {
        try {
            const infoRes = await UserService.getUserInfo(res.locals.user.username);

            res.status(200)
                .json({
                    data: infoRes
                });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const updateRes = await UserService.updateUser(res.locals.user.username, req.body as UserUpdateRequest);

            res.status(200)
                .json(updateRes);
        } catch (e) {
            next(e);
        }
    }
}