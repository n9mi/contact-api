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
const database_1 = __importDefault(require("../application/database"));
const response_1 = require("../error/response");
const auth_1 = require("../validation/auth");
const validation_1 = require("../validation/validation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = __importDefault(require("./jwt"));
class AuthService {
    static register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const registerReq = validation_1.Validation.validate(auth_1.AuthValidation.REGISTER, req);
            const isDuplicateUsername = (yield database_1.default.user.count({
                where: {
                    username: {
                        equals: registerReq.username,
                        mode: 'insensitive'
                    }
                }
            })) != 0;
            if (isDuplicateUsername) {
                throw new response_1.ResponseError(409, "username already exists");
            }
            registerReq.username = registerReq.name.toLowerCase();
            registerReq.password = yield bcrypt_1.default.hash(registerReq.password, 10);
            const user = yield database_1.default.user.create({
                data: registerReq
            });
            return {
                status: "success"
            };
        });
    }
    static login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginReq = validation_1.Validation.validate(auth_1.AuthValidation.LOGIN, req);
            const user = yield database_1.default.user.findUniqueOrThrow({
                where: {
                    username: loginReq.username.toLowerCase()
                }
            }).catch(() => { throw new response_1.ResponseError(401, "can't find specified account"); });
            if (!user.password) {
                throw new response_1.ResponseError(500, "user password hasn't been set");
            }
            const isPasswordValid = yield bcrypt_1.default.compare(loginReq.password, user.password);
            if (!isPasswordValid) {
                throw new response_1.ResponseError(401, "can't find specified account");
            }
            const payload = {
                username: user.username,
            };
            const token = jwt_1.default.getJwt(payload);
            return { token };
        });
    }
}
exports.default = AuthService;
