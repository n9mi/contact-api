import prisma from "../application/database";
import { ResponseError } from "../error/response";
import { ContactRequest, ContactResponse, toContactResponse } from "../model/contact";
import { ContactValidation } from "../validation/contact";
import { Validation } from "../validation/validation";

export default class ContactService {

    static async findById(username: string, id: number): Promise<ContactResponse> {
        const contact = await prisma.contact.findFirstOrThrow({
            where: {
                AND: {
                    username: username,
                    id:  id
                }
            }
        }).catch((e) => { throw new ResponseError(404, "contact doesn't exists") });

        return toContactResponse(contact);
    }

    static async create(username: string, req: ContactRequest): Promise<ContactResponse> {
        const validatedReq = Validation.validate(ContactValidation.CREATE, req);

        const contact = await prisma.contact.create({
            data: {
                ...validatedReq,
                username
            }
        });

        return toContactResponse(contact);
    }
}