import { JwtPayload } from "jsonwebtoken";

export interface JwtCustomPayload extends JwtPayload {
    username: string,
}