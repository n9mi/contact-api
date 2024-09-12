import prisma from "../src/application/database";
import bcrypt from "bcrypt";
import supertest from "supertest";
import { basePath, web } from "../src/application/web";
import logger from "../src/application/logger";

describe("GET /user/info", () => {
    let token: string = "";

    beforeAll(async () => {
        token = await UserTestUtil.getToken();
    });

    afterAll(async () => {
        await UserTestUtil.delete();
    });

    it("should return 200 - get user info", async () => {
        const res = await supertest(web)
            .get(`${basePath}/user/info`)
            .set('Authorization', `Bearer ${token}`);

        logger.debug(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data.username).toBe(UserTestUtil.user.username);
        expect(res.body.data.name).toBe(UserTestUtil.user.name);
    });
});

class UserTestUtil {
    static user = {
        name: "user",
        username: "user",
        password: "password"
    };

    static async create() {
        await prisma.user.create({
            data: {
                name: UserTestUtil.user.name,
                username: UserTestUtil.user.username,
                password: await bcrypt.hash(UserTestUtil.user.password, 10),
                token: ""
            }
        });
    }

    static async delete() {
        await prisma.user.deleteMany({
            where: {
                username: UserTestUtil.user.username
            }
        });
    }

    static async getToken() {
        await UserTestUtil.create();

        const loginRes = await supertest(web)
            .post(`${basePath}/auth/login`)
            .send({
                username: UserTestUtil.user.username,
                password: UserTestUtil.user.password,
            });
        
        return loginRes.body.data.token;
    }
}