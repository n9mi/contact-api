"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.web = exports.basePath = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../router/auth");
const error_1 = require("../middleware/error");
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../router/user");
dotenv_1.default.config();
exports.basePath = process.env.BASE_URL_PATH === undefined ? "/api/v1" : process.env.BASE_URL_PATH;
exports.web = (0, express_1.default)();
exports.web.use(express_1.default.json());
exports.web.use((0, auth_1.getAuthRouter)(exports.basePath));
exports.web.use((0, user_1.getUserRouter)(exports.basePath));
exports.web.use((0, error_1.getErrorMiddleware)());
