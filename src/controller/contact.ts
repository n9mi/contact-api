import { Request, Response, NextFunction } from "express";
import ContactService from "../service/contact";
import { ContactRequest, ContactSearchRequest } from "../model/contact";
import { ResponseError } from "../error/response";

export class ContactController {

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const getReq: ContactSearchRequest = {
                name: req.query.name as string,
                email: req.query.email as string,
                phone: req.query.phone as string,
                page: req.query.page ? Number(req.query.page) : 1,
                page_size: req.query.page_size ? Number(req.query.page_size) : 10
            };
            const getRes = await ContactService.findAll(res.locals.user.username, getReq);
            
            res.status(200)
                .json(getRes);
        } catch (e) {
            next(e);
        }
    }

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