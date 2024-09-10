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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../application/database"));
const response_1 = require("../error/response");
dotenv_1.default.config();
class JwtService {
    static getJwt(payload) {
        return jsonwebtoken_1.default.sign(payload, JwtService.jwtSecretKey, {
            algorithm: "HS256",
            expiresIn: `${JwtService.jwtExpiredInMinutes}m`
        });
    }
    static validateJwt(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jwtDecode = jsonwebtoken_1.default.verify(token, JwtService.jwtSecretKey);
                const isUsernameExists = (yield database_1.default.user.count({
                    where: {
                        username: {
                            equals: jwtDecode.username,
                            mode: 'insensitive'
                        }
                    }
                })) != 0;
                if (!isUsernameExists) {
                    throw new response_1.ResponseError(401, "invalid_jwt");
                }
                return {
                    username: jwtDecode.username,
                };
            }
            catch (e) {
                throw e;
            }
        });
    }
}
JwtService.jwtSecretKey = process.env.JWT_SECRET == undefined ? "secret-key" : process.env.JWT_SECRET;
JwtService.jwtExpiredInMinutes = isNaN(Number(process.env.JWT_EXPIRED_IN_MINUTES)) || Number(process.env.JWT_EXPIRED_IN_MINUTES) < 60 ? 60 : Number(process.env.JWT_EXPIRED_IN_MINUTES);
exports.default = JwtService;
