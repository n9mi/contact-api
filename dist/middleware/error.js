"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMiddleware = void 0;
const zod_1 = require("zod");
const response_1 = require("../error/response");
const jsonwebtoken_1 = require("jsonwebtoken");
const getErrorMiddleware = () => (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (err instanceof zod_1.ZodError) {
        const errItems = {};
        err.issues.forEach((v) => errItems[v.path[0]] = v.message);
        res.status(400).json({
            errors: errItems
        });
    }
    else if (err instanceof response_1.ResponseError) {
        res.status(err.status).json({
            errors: err.message
        });
    }
    else if (err instanceof jsonwebtoken_1.TokenExpiredError) {
        return res.status(401).json({
            errors: "expired_authorization"
        });
    }
    else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
        return res.status(401).json({
            errors: "invalid_token"
        });
    }
    else {
        res.status(500).json({
            errors: "something wrong"
        });
    }
});
exports.getErrorMiddleware = getErrorMiddleware;
