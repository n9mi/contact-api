import { Request, Response, NextFunction } from "express";
import AddressService from "../service/address";
import { AddressRequest } from "../model/address";
import { ResponseError } from "../error/response";

export class AddressController {

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            if (isNaN(Number(req.params.contactId)) || Number(req.params.contactId) < 1) {
                throw new ResponseError(404, "contact doesn't exists");
            }

            const createReq = req.body as AddressRequest;
            createReq.contact_id = Number(req.params.contactId);

            const createRes = await AddressService.create(res.locals.user.usename, createReq);

            return res.status(200)
                .json({
                    data: createRes
                });
        } catch (e) {
            next(e);
        }
    }
}