import prisma from "../src/application/database";
import bcrypt from "bcrypt";
import supertest from "supertest";
import { basePath, web } from "../src/application/web";
import logger from "../src/application/logger";

describe("GET /user/info", () => {
    let token: string = "";

    beforeAll(async () => {
        await UserTestUtil.create(UserTestUtil.user);
        token = await UserTestUtil.getToken(UserTestUtil.user.username, UserTestUtil.user.password);
    });

    afterAll(async () => {
        await UserTestUtil.delete();
    });

    it("should return 200 - success get user info", async () => {
        const res = await supertest(web)
            .get(`${basePath}/user/info`)
            .set('Authorization', `Bearer ${token}`);

        logger.debug(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data.username).toBe(UserTestUtil.user.username);
        expect(res.body.data.name).toBe(UserTestUtil.user.name);
    });

    it("should return 401 - unauthorized", async () => {
        const res = await supertest(web)
            .get(`${basePath}/user/info`);

        logger.debug(res.body);
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
    });
});

describe("PUT /user/update", () => {
    const newUserData = {
        name: "user update",
        username: "user_update",
        password: "userupdate"
    };

    afterAll(() => {
       UserTestUtil.delete(); 
    });

    it ("should return 200 - success updating user info", async () => {
        await UserTestUtil.create(UserTestUtil.user);
        const token = await UserTestUtil.getToken(UserTestUtil.user.username, UserTestUtil.user.password);

        const resUpdate = await supertest(web)
            .put(`${basePath}/user/update`)
            .send(newUserData)
            .set('Authorization', `Bearer ${token}`);
        
        logger.debug("update response : ", resUpdate.body);
        expect(resUpdate.status).toBe(200);
        expect(resUpdate.body.status).toBe("success");

        const resLoginWithNewCred = await supertest(web)
            .post(`${basePath}/auth/login`)
            .send({
                username: newUserData.username,
                password: newUserData.password
            });

        logger.debug("login response : ", resLoginWithNewCred.body);
        expect(resLoginWithNewCred.status).toBe(200);
        expect(resLoginWithNewCred.body.data.token).toBeDefined();
    });

    it("should return 401 - unauthorized", async () => {
        const resUpdate = await supertest(web)
            .put(`${basePath}/user/update`)
            .send(newUserData);
        
        logger.debug("update response : ", resUpdate.body);
        expect(resUpdate.status).toBe(401);
        expect(resUpdate.body.errors).toBeDefined();
    });
});

class UserTestUtil {
    static user = {
        name: "user",
        username: "user",
        password: "password"
    };

    static async create(user : { name: string, username: string, password: string }) {
        await prisma.user.create({
            data: {
                name: user.name,
                username: user.username,
                password: await bcrypt.hash(user.password, 10),
                token: ""
            }
        });
    }

    static async delete() {
        await prisma.user.deleteMany({});
    }

    static async getToken(username: string, password: string) {
        const loginRes = await supertest(web)
            .post(`${basePath}/auth/login`)
            .send({
                username: username,
                password: password,
            });
        
        return loginRes.body.data.token;
    }
}