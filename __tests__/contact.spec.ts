import prisma from "../src/application/database";
import bcrypt from "bcrypt";
import supertest from "supertest";
import { basePath, web } from "../src/application/web";
import logger from "../src/application/logger";

describe("POST /contact", () => {
    let token: string = "";

    beforeAll(async () => {
        token = await ContactTestUtil.getToken();
    });

    afterAll(async () => {
        await ContactTestUtil.deleteContact();
        await ContactTestUtil.deleteUser();
    })

    const newContact = {
        first_name: "First",
        last_name: "Last",
        email: "first@last.com",
        phone: "08123456789"
    }

    it("should return 200 - success creating contact", async () => {
        const res = await supertest(web)
            .post(`${basePath}/contact`)
            .send(newContact)
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeGreaterThanOrEqual(1);
        expect(res.body.data.first_name).toBe(newContact.first_name);
        expect(res.body.data.last_name).toBe(newContact.last_name);
        expect(res.body.data.email).toBe(newContact.email);
        expect(res.body.data.phone).toBe(newContact.phone);
    }); 

    it("should return 200 - success creating contact with emty last_name, email, and phone", async () => {
        const res = await supertest(web)
            .post(`${basePath}/contact`)
            .send({
                first_name: newContact.first_name
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeGreaterThanOrEqual(1);
        expect(res.body.data.first_name).toBe(newContact.first_name);
        expect(res.body.data.last_name).toBe("");
        expect(res.body.data.email).toBe("");
        expect(res.body.data.phone).toBe("");
    }); 

    it("should return 400 - bad request invalid email", async () => {
        const res = await supertest(web)
            .post(`${basePath}/contact`)
            .send({
                first_name: newContact.first_name,
                last_name: newContact.last_name,
                email: "test",
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(400);
        expect(res.body.errors.email).toBeDefined();
    });

    it("should return 400 - bad request phone number more than 20 characters", async () => {
        const res = await supertest(web)
            .post(`${basePath}/contact`)
            .send({
                first_name: newContact.first_name,
                last_name: newContact.last_name,
                phone: "0123456789012345678901",
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(400);
        expect(res.body.errors.phone).toBeDefined();
    });
})

class ContactTestUtil {
    static user = {
        name: "user_test_contact",
        username: "user_test_contact",
        password: "password"
    };

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

    static async deleteContact() {
        await prisma.contact.deleteMany({});
    }
}