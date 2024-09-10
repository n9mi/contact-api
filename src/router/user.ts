import express from "express";
import { UserController } from "../controller/user";
import { accessValidation } from "../middleware/accessValidation";

export const getUserRouter = (basePath: string) => {
    const userRouter = express.Router();
    userRouter.use(accessValidation);
    userRouter.get(`${basePath}/user/info`, UserController.info);

    return userRouter;
}