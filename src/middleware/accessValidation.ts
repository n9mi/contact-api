import { Request, Response, NextFunction } from "express";
import JwtService from "../service/jwt";

export const accessValidation = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            errors: "empty_authorization"
        });
    }

    const token = authorization.split(' ')[1];
    try {
        const userLocals = await JwtService.validateJwt(token);
        res.locals.user = userLocals;
    } catch (e) {
        next(e);
    }

    next();
}