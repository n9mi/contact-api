import prisma from "../src/application/database";
import bcrypt from "bcrypt";
import supertest from "supertest";
import { basePath, web } from "../src/application/web";
import logger from "../src/application/logger";
import { Contact } from "@prisma/client";

describe("GET /contacts", () => {
    let token: string = "";
    let createdContact: Contact = {} as Contact;

    beforeAll(async () => {
        token = await ContactTestUtil.getToken();
        createdContact = await ContactTestUtil.createContact();
    });

    afterAll(async () => {
        await ContactTestUtil.deleteContact();
        await ContactTestUtil.deleteUser();
    });

    it("should be able to get all contact", async () => {
        const res = await supertest(web)
            .get(`${basePath}/contacts`)
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(1);
        expect(res.body.paging.current_page).toBe(1);
        expect(res.body.paging.total_page).toBe(1);
        expect(res.body.paging.page_size).toBe(10);
    });

    it("should be able to search contacts by name - found", async () => {
        const res = await supertest(web)
            .get(`${basePath}/contacts`)
            .query({
                name: "ast"
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(1);
        expect(res.body.paging.current_page).toBe(1);
        expect(res.body.paging.total_page).toBe(1);
        expect(res.body.paging.page_size).toBe(10);
    });

    it("should be able to search contacts by name - not found", async () => {
        const res = await supertest(web)
            .get(`${basePath}/contacts`)
            .query({
                name: "random"
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(0);
        expect(res.body.paging.current_page).toBe(1);
        expect(res.body.paging.total_page).toBe(0);
        expect(res.body.paging.page_size).toBe(10);
    });

    it("should be able to search contacts by email - found", async () => {
        const res = await supertest(web)
            .get(`${basePath}/contacts`)
            .query({
                email: "t.co"
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(1);
        expect(res.body.paging.current_page).toBe(1);
        expect(res.body.paging.total_page).toBe(1);
        expect(res.body.paging.page_size).toBe(10);
    });

    it("should be able to search contacts by phone - found", async () => {
        const res = await supertest(web)
            .get(`${basePath}/contacts`)
            .query({
                phone: "081"
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(1);
        expect(res.body.paging.current_page).toBe(1);
        expect(res.body.paging.total_page).toBe(1);
        expect(res.body.paging.page_size).toBe(10);
    });

    it("should be able to search contacts by phone - not found", async () => {
        const res = await supertest(web)
            .get(`${basePath}/contacts`)
            .query({
                phone: "99"
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(0);
        expect(res.body.paging.current_page).toBe(1);
        expect(res.body.paging.total_page).toBe(0);
        expect(res.body.paging.page_size).toBe(10);
    });
});

describe("GET /contacts:id", () => { 
    let token: string = "";
    let createdContact: Contact = {} as Contact;

    beforeAll(async () => {
        token = await ContactTestUtil.getToken();
        createdContact = await ContactTestUtil.createContact();
    });

    afterAll(async () => {
        await ContactTestUtil.deleteContact();
        await ContactTestUtil.deleteUser();
    });

    it ("should return 200 - success getting a contact", async () => {
        const res = await supertest(web)
            .get(`${basePath}/contacts/${createdContact.id}`)
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(createdContact.id);
        expect(res.body.data.first_name).toBe(createdContact.first_name);
        expect(res.body.data.last_name).toBe(createdContact.last_name);
        expect(res.body.data.email).toBe(createdContact.email);
        expect(res.body.data.phone).toBe(createdContact.phone);
    });

    it("should return 404 - invalid contact id", async () => {
        const res = await supertest(web)
            .get(`${basePath}/contacts/test123`)
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(404);
        expect(res.body.errors).toBeDefined();
    });

    it("should return 404 - contact id doesn't exists", async () => {
        const res = await supertest(web)
            .get(`${basePath}/contacts/10000`)
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(404);
        expect(res.body.errors).toBeDefined();
    });

    it("should return 401 - empty authorization", async () => {
        const res = await supertest(web)
            .get(`${basePath}/contacts/${createdContact.id}`);

        logger.info(res.body);
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
    });
});

describe("POST /contacts", () => {
    let token: string = "";

    beforeAll(async () => {
        token = await ContactTestUtil.getToken();
    });

    afterAll(async () => {
        await ContactTestUtil.deleteContact();
        await ContactTestUtil.deleteUser();
    })

    it("should return 200 - success creating contact", async () => {
        const res = await supertest(web)
            .post(`${basePath}/contacts`)
            .send(ContactTestUtil.contact)
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeGreaterThanOrEqual(1);
        expect(res.body.data.first_name).toBe(ContactTestUtil.contact.first_name);
        expect(res.body.data.last_name).toBe(ContactTestUtil.contact.last_name);
        expect(res.body.data.email).toBe(ContactTestUtil.contact.email);
        expect(res.body.data.phone).toBe(ContactTestUtil.contact.phone);
    }); 

    it("should return 200 - success creating contact with emty last_name, email, and phone", async () => {
        const res = await supertest(web)
            .post(`${basePath}/contacts`)
            .send({
                first_name: ContactTestUtil.contact.first_name
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeGreaterThanOrEqual(1);
        expect(res.body.data.first_name).toBe(ContactTestUtil.contact.first_name);
        expect(res.body.data.last_name).toBe("");
        expect(res.body.data.email).toBe("");
        expect(res.body.data.phone).toBe("");
    }); 

    it("should return 400 - bad request invalid email", async () => {
        const res = await supertest(web)
            .post(`${basePath}/contacts`)
            .send({
                first_name: ContactTestUtil.contact.first_name,
                last_name: ContactTestUtil.contact.last_name,
                email: "test",
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(400);
        expect(res.body.errors.email).toBeDefined();
    });

    it("should return 400 - bad request phone number more than 20 characters", async () => {
        const res = await supertest(web)
            .post(`${basePath}/contacts`)
            .send({
                first_name: ContactTestUtil.contact.first_name,
                last_name: ContactTestUtil.contact.last_name,
                phone: "0123456789012345678901",
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(400);
        expect(res.body.errors.phone).toBeDefined();
    });

    it("should return 401 - empty authorization", async () => {
        const res = await supertest(web)
            .post(`${basePath}/contacts`)
            .send({
                first_name: ContactTestUtil.contact.first_name
            });

        logger.info(res.body);
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
    });
})

class ContactTestUtil {
    static user = {
        name: "user_test_contact",
        username: "user_test_contact",
        password: "password"
    };

    static contact = {
        first_name: "First",
        last_name: "Last",
        email: "first@last.com",
        phone: "08123456789"
    }

    static async create() {
        await prisma.user.create({
            data: {
                name: ContactTestUtil.user.name, 
                username: ContactTestUtil.user.username, 
                password: await bcrypt.hash(ContactTestUtil.user.password, 10)
            }
        });
    }

    static async getToken() {
        await ContactTestUtil.create();

        const loginRes = await supertest(web)
            .post(`${basePath}/auth/login`)
            .send({
                username: ContactTestUtil.user.username,
                password: ContactTestUtil.user.password,
            });
    
        return loginRes.body.data.token;
    }
    
    static async deleteUser() {
        await prisma.user.deleteMany({});
    }

    static async createContact(): Promise<Contact> {
        const contact = await prisma.contact.create({
            data: {
                ...ContactTestUtil.contact,
                username: ContactTestUtil.user.username
            }
        });

        return contact as Contact;
    }

    static async deleteContact() {
        await prisma.contact.deleteMany({});
    }
}