import { Request, Response, NextFunction } from "express";
import ContactService from "../service/contact";
import { ContactRequest } from "../model/contact";

export class ContactController {

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const createRes = await ContactService.create(res.locals.user.username, req.body as ContactRequest);
        
            res.status(200)
                .json({
                    data: createRes
                });
        } catch (e) {
            next(e);
        }
    }
}