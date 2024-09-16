import { Contact } from "@prisma/client";
import prisma from "../application/database";
import { ResponseError } from "../error/response";
import { ContactRequest, ContactResponse, ContactSearchRequest, toContactResponse } from "../model/contact";
import { Pageable } from "../model/page";
import { ContactValidation } from "../validation/contact";
import { Validation } from "../validation/validation";

export default class ContactService {

    static async findAll(username: string, req: ContactSearchRequest): Promise<Pageable<ContactResponse>> {
        const validatedReq = Validation.validate(ContactValidation.SEARCH, req);
        const skip = (validatedReq.page - 1) * validatedReq.page_size;

        const filters = [];
        if (validatedReq.name) {
            filters.push({
                OR: [
                    {
                        first_name: {
                            contains: validatedReq.name,
                            // mode: "insensitive",
                        }
                    },
                    {
                        last_name: {
                            contains: validatedReq.name,
                            // mode: "insensitive"
                        }
                    }
                ]
            })
        }
        if (validatedReq.email) {
            filters.push({
                email: {
                    contains: validatedReq.email
                }
            });
        }
        if (validatedReq.phone) {
            filters.push({
                phone: {
                    contains: validatedReq.phone
                }
            });
        }

        let contacts: Contact[] = [];
        let total: number = 0;
        if (filters.length > 0) {
            contacts = await prisma.contact.findMany({
                where: {
                    username: username,
                    AND: filters
                },
                take: validatedReq.page_size,
                skip: skip
            });
            total = await prisma.contact.count({
                where: {
                    username: username,
                    AND: filters
                },
            });
        } else {
            contacts = await prisma.contact.findMany({
                where: {
                    username: username
                },
                take: validatedReq.page_size,
                skip: skip
            });
            total = await prisma.contact.count({
                where: {
                    username: username
                },
            });
        }
        
        return {
            data: contacts.map(c => toContactResponse(c)),
            paging: {
                current_page: validatedReq.page,
                total_page: Math.ceil(total / validatedReq.page_size),
                page_size: validatedReq.page_size
            }
        };
    }

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