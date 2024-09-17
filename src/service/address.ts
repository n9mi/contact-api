import prisma from "../application/database";
import { ResponseError } from "../error/response";
import { AddressListRequest, AddressRequest, AddressResponse, toAddressResponse } from "../model/address";
import { Pageable } from "../model/page";
import { AddressValidation } from "../validation/address";
import { Validation } from "../validation/validation";

export default class AddressService {

    static async findAll(username: string, contactId: number, req: AddressListRequest): Promise<Pageable<AddressResponse>> {
        const validatedReq = Validation.validate(AddressValidation.LIST, req);

        const isContactExists = await prisma.contact.count({
            where: {
                id: contactId,
                username: username
            }
        }) === 1;
        if (!isContactExists) {
            throw new ResponseError(404, "contact doesn't exists");
        }

        const skip = (validatedReq.page - 1) * validatedReq.page_size;
        const addresses = await prisma.address.findMany({
            where: {
                contact_id: contactId,
            },
            take: validatedReq.page_size,
            skip: skip
        });
        const total = await prisma.address.count({
            where: {
                contact_id: contactId
            }
        });

        return {
            data: addresses.map(a => toAddressResponse(a)),
            paging: {
                current_page: validatedReq.page,
                total_page: Math.ceil(total / validatedReq.page_size),
                page_size: validatedReq.page_size    
            }
        }
    }

    static async create(username: string, contactId: number, req: AddressRequest) {
        const validateReq = Validation.validate(AddressValidation.SAVE, req);

        const isContactExists = await prisma.contact.count({
            where: {
                id: contactId,
                username: username
            }
        }) === 1;
        if (!isContactExists) {
            throw new ResponseError(404, "contact doesn't exists");
        }

        const address = await prisma.address.create({
            data: {
                ...validateReq,
                contact_id: contactId
            }
        });

        return toAddressResponse(address);
    }

    static async update(username: string, contactId: number, addressId: number, req: AddressRequest) {
        const validatedReq = Validation.validate(AddressValidation.SAVE, req);

        const isContactExists = await prisma.contact.count({
            where: {
                id: contactId,
                username: username
            }
        }) === 1;
        if (!isContactExists) {
            throw new ResponseError(404, "contact doesn't exists");
        }

        const isAddressExists = await prisma.address.count({
            where: {
                id: addressId,
                contact_id: contactId,
            }
        }) === 1;
        if (!isAddressExists) {
            throw new ResponseError(404, "address doesn't exists");
        }

        const address = await prisma.address.update({
            where: {
                id: addressId,
                contact_id: contactId,
            },
            data: validatedReq
        });

        return toAddressResponse(address);
    }

    static async delete(username: string, contactId: number, addressId: number): Promise<boolean> {
        const isContactExists = await prisma.contact.count({
            where: {
                id: contactId,
                username: username
            }
        }) === 1;
        if (!isContactExists) {
            throw new ResponseError(404, "contact doesn't exists");
        }

        const isAddressExists = await prisma.address.count({
            where: {
                id: addressId,
                contact_id: contactId,
            }
        }) === 1;
        if (!isAddressExists) {
            throw new ResponseError(404, "address doesn't exists");
        }

        await prisma.address.delete({
            where: {
                id: addressId,
                contact_id: contactId,
            }
        });

        return true;
    }
}