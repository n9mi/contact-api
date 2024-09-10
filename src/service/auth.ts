import prisma from "../application/database";
import { ResponseError } from "../error/response";
import { LoginRequest, RegisterRequest, TokenResponse } from "../model/auth";
import { AuthValidation } from "../validation/auth";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";
import JwtService from "./jwt";
import { JwtCustomPayload } from "../types/jwt";
import { StatusResponse } from "../model/common";

export default class AuthService {

    static async register(req: RegisterRequest) : Promise<StatusResponse> {
        const registerReq = Validation.validate(AuthValidation.REGISTER, req);

        const isDuplicateUsername = await prisma.user.count({
            where: {
                username: {
                    equals: registerReq.username,
                    mode: 'insensitive'
                }
            }
        }) != 0;
        if (isDuplicateUsername) {
            throw new ResponseError(409, "username already exists");
        }

        registerReq.username = registerReq.name.toLowerCase()
        registerReq.password = await bcrypt.hash(registerReq.password, 10);

        const user = await prisma.user.create({
            data: registerReq
        });

        return {
            status: "success"
        };
    }  
    
    static async login(req: LoginRequest) : Promise<TokenResponse> {
        const loginReq = Validation.validate(AuthValidation.LOGIN, req);

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                username: loginReq.username.toLowerCase()
            }
        }).catch(() => 
            { throw new ResponseError(401, "can't find specified account") });

        if (!user.password) {
            throw new ResponseError(500, "user password hasn't been set");
        }

        const isPasswordValid = await bcrypt.compare(loginReq.password, user.password);
        if (!isPasswordValid) {
            throw new ResponseError(401, "can't find specified account");
        }

        const payload: JwtCustomPayload = {
            username: user.username,
        };
        const token = JwtService.getJwt(payload);

        return { token }
    }
}