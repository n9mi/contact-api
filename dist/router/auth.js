"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
const getAuthRouter = (basePath) => {
    const authRouter = express_1.default.Router();
    authRouter.post(`${basePath}/auth/register`, auth_1.AuthController.register);
    authRouter.post(`${basePath}/auth/login`, auth_1.AuthController.login);
    return authRouter;
};
exports.getAuthRouter = getAuthRouter;
