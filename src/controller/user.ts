import { Request, Response, NextFunction } from "express";
import UserService from "../service/user";

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
}