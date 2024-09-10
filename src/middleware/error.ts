import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const getErrorMiddleware = () => 
    async ( err: Error, req: Request, res: Response, next: NextFunction ) => {
        if (err instanceof ZodError) {
            const errItems: Record<string, string> = {};
            err.issues.forEach((v) => errItems[v.path[0]] = v.message );

            res.status(400).json({
                errors: errItems
            });
        } else if (err instanceof ResponseError) {
            res.status(err.status).json({
                errors: err.message
            });
        } else if (err instanceof TokenExpiredError) {
            return res.status(401).json({
                errors: "expired_authorization"
            });
        } else if (err instanceof JsonWebTokenError) {
            return res.status(401).json({
                errors: "invalid_token"
            });
        }
        else {
            res.status(500).json({
                errors: "something wrong"
            });
        }
    }
