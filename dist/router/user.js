"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const accessValidation_1 = require("../middleware/accessValidation");
const getUserRouter = (basePath) => {
    const userRouter = express_1.default.Router();
    userRouter.use(accessValidation_1.accessValidation);
    userRouter.get(`${basePath}/user/info`, user_1.UserController.info);
    return userRouter;
};
exports.getUserRouter = getUserRouter;
