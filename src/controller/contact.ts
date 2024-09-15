import { Request, Response, NextFunction } from "express";
import ContactService from "../service/contact";
import { ContactRequest } from "../model/contact";
import { ResponseError } from "../error/response";

export class ContactController {

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            if (isNaN(Number(req.params.id))) {
                throw new ResponseError(404, "contact doesn't exists")
            }
            const getRes = await ContactService.findById(res.locals.user.username, Number(req.params.id));

            res.status(200)
                .json({
                    data: getRes
                })
        } catch (e) {
            next(e);
        }
    }

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