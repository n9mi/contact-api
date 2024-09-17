import prisma from "../application/database";
import { ResponseError } from "../error/response";
import { AddressRequest, toAddressResponse } from "../model/address";
import { AddressValidation } from "../validation/address";
import { Validation } from "../validation/validation";

export default class AddressService {

    // static async 

    static async create(username: string, req: AddressRequest) {
        const validateReq = Validation.validate(AddressValidation.SAVE, req);

        const isContactExists = await prisma.contact.count({
            where: {
                id: validateReq.contact_id,
                username: username
            }
        }) === 1;
        if (!isContactExists) {
            throw new ResponseError(404, "contact doesn't exists");
        }

        const address = await prisma.address.create({
            data: validateReq
        });

        return toAddressResponse(address);
    }
}