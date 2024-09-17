import { Request, Response, NextFunction } from "express";
import AddressService from "../service/address";
import { AddressRequest } from "../model/address";
import { ResponseError } from "../error/response";

export class AddressController {

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            if (isNaN(Number(req.params.contactId)) || Number(req.params.contactId) < 1) {
                throw new ResponseError(404, "contact doesn't exists");
            }

            const getReq = {
                page: req.query.page ? Number(req.query.page) : 1,
                page_size: req.query.page_size ? Number(req.query.page_size) : 10
            };
            const getRes = await AddressService.findAll(res.locals.user.usename, Number(req.params.contactId), getReq);
            
            res.status(200)
                .json(getRes);
        } catch (e) {
            next(e);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            if (isNaN(Number(req.params.contactId)) || Number(req.params.contactId) < 1) {
                throw new ResponseError(404, "contact doesn't exists");
            }

            const createReq = req.body as AddressRequest;
            const contactId = Number(req.params.contactId);

            const createRes = await AddressService.create(res.locals.user.usename, contactId, createReq);

            return res.status(200)
                .json({
                    data: createRes
                });
        } catch (e) {
            next(e);
        }
    }
}