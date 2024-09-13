import prisma from "../application/database";
import { ContactRequest, ContactResponse, toContactResponse } from "../model/contact";
import { ContactValidation } from "../validation/contact";
import { Validation } from "../validation/validation";

export default class ContactService {

    static async create(username: string, req: ContactRequest): Promise<ContactResponse> {
        const validatedReq = Validation.validate(ContactValidation.CREATE, req);

        console.info(validatedReq);

        const contact = await prisma.contact.create({
            data: {
                ...validatedReq,
                username
            }
        });

        return toContactResponse(contact);
    }
}