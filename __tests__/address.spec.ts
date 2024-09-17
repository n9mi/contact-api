import prisma from "../src/application/database";
import bcrypt from "bcrypt";
import supertest from "supertest";
import { basePath, web } from "../src/application/web";
import { Address, Contact } from "@prisma/client";
import logger from "../src/application/logger";

describe("GET /contacts/:contactId/addresses", () => {
    let token: string = "";
    let contact: Contact = {} as Contact;
    let address: Address = {} as Address;

    beforeAll(async () => {
        token = await AddressTestUtil.getToken();
        contact = await AddressTestUtil.createContact();
        address = await AddressTestUtil.createAddress(contact.id);
    });

    afterAll(async () => {
        await AddressTestUtil.deleteAddress();
        await AddressTestUtil.deleteContact();
        await AddressTestUtil.deleteUser();
    })

    it("should be able to get all address", async () => {
        const res = await supertest(web)
            .get(`${basePath}/contacts/${contact.id}/addresses`)
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(1);
        expect(res.body.paging.page_size).toBe(10);
        expect(res.body.paging.total_page).toBe(1);
        expect(res.body.paging.current_page).toBe(1);
    });

    it("should be able to get all address - pagination", async () => {
        const res = await supertest(web)
            .get(`${basePath}/contacts/${contact.id}/addresses`)
            .query({
                page: 2,
                page_size: 5
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(0);
        expect(res.body.paging.page_size).toBe(5);
        expect(res.body.paging.total_page).toBe(1);
        expect(res.body.paging.current_page).toBe(2);
    });

    it("should return 404 - not found contact", async () => {
        const res = await supertest(web)
            .get(`${basePath}/contacts/${1000}/addresses`)
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(404);
        expect(res.body.errors).toBeDefined();
    });

    it("should return 401 - empty authorization", async () => {
        const res = await supertest(web)
            .get(`${basePath}/contacts/${contact.id}/addresses`)

        logger.info(res.body);
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
    });
});

describe("POST /contacts/:contactId/addresses", () => {
    let token: string = "";
    let contact: Contact = {} as Contact;

    beforeAll(async () => {
        token = await AddressTestUtil.getToken();
        contact = await AddressTestUtil.createContact();
    });

    afterAll(async () => {
        await AddressTestUtil.deleteAddress();
        await AddressTestUtil.deleteContact();
        await AddressTestUtil.deleteUser();
    })

    it("should return 200 - success creating an address", async () => {
        const res = await supertest(web)
            .post(`${basePath}/contacts/${contact.id}/addresses`)
            .send(AddressTestUtil.address)
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeGreaterThanOrEqual(1);
        expect(res.body.data.street).toBe(AddressTestUtil.address.street);
        expect(res.body.data.city).toBe(AddressTestUtil.address.city);
        expect(res.body.data.province).toBe(AddressTestUtil.address.province);
        expect(res.body.data.country).toBe(AddressTestUtil.address.country);
        expect(res.body.data.postal_code).toBe(AddressTestUtil.address.postal_code);
    });

    it("should return 200 - success creating an address with empty street, city, and province", async () => {
        const res = await supertest(web)
            .post(`${basePath}/contacts/${contact.id}/addresses`)
            .send({
                country: AddressTestUtil.address.country,
                postal_code: AddressTestUtil.address.postal_code,
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeGreaterThanOrEqual(1);
        expect(res.body.data.street).toBe("");
        expect(res.body.data.city).toBe("");
        expect(res.body.data.province).toBe("");
        expect(res.body.data.country).toBe(AddressTestUtil.address.country);
        expect(res.body.data.postal_code).toBe(AddressTestUtil.address.postal_code);
    });

    it("should return 400 - invalid postal code", async () => {
        const res = await supertest(web)
            .post(`${basePath}/contacts/${contact.id}/addresses`)
            .send({
                country: AddressTestUtil.address.country,
                postal_code: "123",
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(400);
        expect(res.body.errors.postal_code).toBeDefined();
    });

    it("should return 401 - empty authorization", async () => {
        const res = await supertest(web)
            .post(`${basePath}/contacts/${contact.id}/addresses`)
            .send(AddressTestUtil.address);

        logger.info(res.body);
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
    });
});

describe("POST /contacts/:contactId/addresses", () => {
    let token: string = "";
    let contact: Contact = {} as Contact;
    let address: Address = {} as Address;

    beforeAll(async () => {
        token = await AddressTestUtil.getToken();
        contact = await AddressTestUtil.createContact();
        address = await AddressTestUtil.createAddress(contact.id);
    });

    afterAll(async () => {
        await AddressTestUtil.deleteAddress();
        await AddressTestUtil.deleteContact();
        await AddressTestUtil.deleteUser();
    });

    const addressUpdated = {
        street: "Test Street Updated",
        city: "Test City Updated",
        province: "Test Province Updated",
        country: "Test Country Updated",
        postal_code: "123450"
    };

    it("should return 200 - success updating address with empty street, city, and province", async () => {
        const res = await supertest(web)
            .put(`${basePath}/contacts/${contact.id}/addresses/${address.id}`)
            .send({
                country: AddressTestUtil.address.country + " recently updated",
                postal_code: AddressTestUtil.address.postal_code + "9",
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data.street).toBe(AddressTestUtil.address.street);
        expect(res.body.data.city).toBe(AddressTestUtil.address.city);
        expect(res.body.data.province).toBe(AddressTestUtil.address.province);
        expect(res.body.data.country).toBe(AddressTestUtil.address.country + " recently updated");
        expect(res.body.data.postal_code).toBe(AddressTestUtil.address.postal_code + "9");
    });

    it("should return 200 - success updating address", async () => {
        const res = await supertest(web)
            .put(`${basePath}/contacts/${contact.id}/addresses/${address.id}`)
            .send(addressUpdated)
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data.street).toBe(addressUpdated.street);
        expect(res.body.data.city).toBe(addressUpdated.city);
        expect(res.body.data.province).toBe(addressUpdated.province);
        expect(res.body.data.country).toBe(addressUpdated.country);
        expect(res.body.data.postal_code).toBe(addressUpdated.postal_code);
    });

    it("should return 400 - invalid postal code", async () => {
        const res = await supertest(web)
            .put(`${basePath}/contacts/${contact.id}/addresses/${address.id}`)
            .send({
                country: addressUpdated.country,
                postal_code: "123"
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(400);
        expect(res.body.errors.postal_code).toBeDefined();
    });

    it("should return 404 - contact doesn't exists", async () => {
        const res = await supertest(web)
            .put(`${basePath}/contacts/${1000}/addresses/${address.id}`)
            .send({
                country: addressUpdated.country,
                postal_code: addressUpdated.postal_code,
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(404);
        expect(res.body.errors).toBeDefined();
    });

    it("should return 404 - address doesn't exists", async () => {
        const res = await supertest(web)
            .put(`${basePath}/contacts/${contact.id}/addresses/${1000}`)
            .send({
                country: addressUpdated.country,
                postal_code: addressUpdated.postal_code,
            })
            .set('Authorization', `Bearer ${token}`);

        logger.info(res.body);
        expect(res.status).toBe(404);
        expect(res.body.errors).toBeDefined();
    });

    it("should return 401 - empty authorization", async () => {
        const res = await supertest(web)
            .put(`${basePath}/contacts/${contact.id}/addresses/${address.id}`)
            .send({
                country: addressUpdated.country,
                postal_code: addressUpdated.postal_code,
            });

        logger.info(res.body);
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
    });
});

class AddressTestUtil {
    static user = {
        name: "user_test_address",
        username: "user_test_address",
        password: "password"
    };

    static contact = {
        first_name: "First",
        last_name: "Last",
        email: "first@last.com",
        phone: "08123456789"
    };

    static address = {
        street: "Test Street",
        city: "Test City",
        province: "Test Province",
        country: "Test Country",
        postal_code: "123456",
    };

    static async createUser() {
        await prisma.user.create({
            data: {
                name: AddressTestUtil.user.name, 
                username: AddressTestUtil.user.username, 
                password: await bcrypt.hash(AddressTestUtil.user.password, 10)
            }
        });
    }

    static async getToken() {
        await AddressTestUtil.createUser();

        const loginRes = await supertest(web)
            .post(`${basePath}/auth/login`)
            .send({
                username: AddressTestUtil.user.username,
                password: AddressTestUtil.user.password,
            });
    
        return loginRes.body.data.token;
    }
    
    static async deleteUser() {
        await prisma.user.deleteMany({});
    }

    static async createContact(): Promise<Contact> {
        const contact = await prisma.contact.create({
            data: {
                ...AddressTestUtil.contact,
                username: AddressTestUtil.user.username
            }
        });

        return contact as Contact;
    }

    static async deleteContact() {
        await prisma.contact.deleteMany({});
    }
    
    static async createAddress(contactId: number): Promise<Address> {
        const address = await prisma.address.create({
            data: {
                ...AddressTestUtil.address,
                contact_id: contactId
            }
        });

        return address as Address;
    }
    
    static async deleteAddress() {
        await prisma.address.deleteMany({});
    }
}