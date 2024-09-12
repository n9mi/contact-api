import supertest from "supertest";
import { web, basePath } from "../src/application/web";
import logger from "../src/application/logger";
import bcrypt from "bcrypt";
import prisma from "../src/application/database";

describe("POST /auth/register", () => {
    afterEach(async () => {
        await AuthTestUtils.delete()
    })

    it("should return 200 - register new user", async () => {
        const res = await supertest(web)
            .post(`${basePath}/auth/register`)
            .send({
                username: AuthTestUtils.user.username,
                password: await bcrypt.hash(AuthTestUtils.user.password, 10),
                name: AuthTestUtils.user.name,
            });

        logger.debug(res.body);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
    });

    it("should return 400 - bad request error", async () => {
        const res = await supertest(web)
            .post(`${basePath}/auth/register`)
            .send({
                username: "",
                password: "",
                name: ""
            });

        logger.debug(res.body);
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
    });

    it("should return 409 - conflict when registering with existing username", async () => {
        await AuthTestUtils.create();

        const res = await supertest(web)
            .post(`${basePath}/auth/register`)
            .send({
                username: AuthTestUtils.user.username,
                password: await bcrypt.hash(AuthTestUtils.user.password, 10),
                name: AuthTestUtils.user.name,
            });

        logger.debug(res.body);
        expect(res.status).toBe(409);
        expect(res.body.errors).toBeDefined();
    });
});

describe("POST /auth/login", () => {
    beforeAll(async () => {
        await AuthTestUtils.create();
    });

    it("should return 200 - login success", async () => {
        const res = await supertest(web)
            .post(`${basePath}/auth/login`)
            .send({
                username: AuthTestUtils.user.username,
                password: AuthTestUtils.user.password,
            });

        logger.debug(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data.token).toBeDefined();

        await AuthTestUtils.delete();
    });

    it("should return 400 - bad request", async () => {
        const res = await supertest(web)
            .post(`${basePath}/auth/login`)
            .send({
                username: "",
                password: "",
            });

        logger.debug(res.body);
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
    });

    it("should return 401 - login failed with wrong credentials", async () => {
        const res = await supertest(web)
            .post(`${basePath}/auth/login`)
            .send({
                username: "randomusername",
                password: "randompassword",
            });

        logger.debug(res.body);
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
    });
});

class AuthTestUtils {
    static user = {
        name: "user",
        username: "user",
        password: "password",
    };

    static async create() {
        await prisma.user.create({
            data: {
                username: AuthTestUtils.user.username,
                name: AuthTestUtils.user.name,
                password: await bcrypt.hash(AuthTestUtils.user.password, 10),
                token: "",
            }
        });
    }

    static async delete() {
        await prisma.user.deleteMany({
            where: {
                username: AuthTestUtils.user.username,
            }
        });
    }
}