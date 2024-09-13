import prisma from "../application/database";
import { ResponseError } from "../error/response";
import { StatusResponse } from "../model/common";
import { UserInfoResponse, UserUpdateRequest } from "../model/user";
import bcrypt from "bcrypt";
import { Validation } from "../validation/validation";
import { UserValidation } from "../validation/user";

export default class UserService {
    static async getUserInfo(username: string): Promise<UserInfoResponse> {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                username: {
                    equals: username,
                    mode: 'insensitive' 
                }
            }
        }).catch((e) => { throw new ResponseError(404, "user not found") });

        return {
            username: user.username,
            name: user.name
        }
    }

    static async updateUser(username: string, req: UserUpdateRequest): Promise<StatusResponse> {
        const updateReq = Validation.validate(UserValidation.INFO, req);

        const isExists = await prisma.user.count({
            where: {
                username: {
                    equals: username,
                    mode: 'insensitive'
                }
            }
        }) > 0;
        if (!isExists) {
            throw new ResponseError(404, "user not found");
        }

        if (req.password !== undefined) {
            updateReq.password = await bcrypt.hash(req.password, 10);
        }

        console.info(updateReq);

        await prisma.user.update({
            where: {
                username: username,
            },
            data: updateReq
        });

        return {
            status: "success"
        }
    } 
}