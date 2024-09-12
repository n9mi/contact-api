import prisma from "../application/database";
import { ResponseError } from "../error/response";
import { UserInfoResponse } from "../model/user";

export default class UserService {
    static async getUserInfo(username: string) : Promise<UserInfoResponse> {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                username: {
                    equals: username,
                    mode: 'insensitive' 
                }
            }
        }).catch((e) => { throw new ResponseError(404, "user not found") });
    
        console.info({
            username: user.username,
            name: user.name
        });

        return {
            username: user.username,
            name: user.name
        }
    }
}