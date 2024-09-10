import { Request, Response, NextFunction } from "express";

export class UserController {

    static async info(req: Request, res: Response, next: NextFunction) {
        return res.status(200)
            .json({
                data: res.locals.user
            })
    }
}