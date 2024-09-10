import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { JwtCustomPayload } from "../types/jwt";
import prisma from "../application/database";
import { ResponseError } from "../error/response";
import { UserLocals } from "../model/auth";

dotenv.config();

export default class JwtService {
    static jwtSecretKey: string = process.env.JWT_SECRET == undefined ? "secret-key" : process.env.JWT_SECRET;
    static jwtExpiredInMinutes: number = isNaN(Number(process.env.JWT_EXPIRED_IN_MINUTES)) || Number(process.env.JWT_EXPIRED_IN_MINUTES) < 60 ? 60 : Number(process.env.JWT_EXPIRED_IN_MINUTES);

    static getJwt(payload: JwtCustomPayload): string {
        return jwt.sign(payload, JwtService.jwtSecretKey, {
            algorithm: "HS256",
            expiresIn: `${JwtService.jwtExpiredInMinutes}m` 
        });
    }

    static async validateJwt(token: string): Promise<UserLocals> {
        try {
            const jwtDecode = jwt.verify(token, JwtService.jwtSecretKey) as JwtCustomPayload;

            const isUsernameExists = await prisma.user.count({
                where: {
                    username: {
                        equals: jwtDecode.username,
                        mode: 'insensitive'
                    }
                }
            }) != 0;
            if (!isUsernameExists) {
                throw new ResponseError(401, "invalid_jwt");
            }

            return {
                username: jwtDecode.username,
            }
        } catch (e) {
            throw e;
        }
    }
} 