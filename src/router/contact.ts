import express from "express";
import { ContactController } from "../controller/contact";
import { accessValidation } from "../middleware/accessValidation";

export const getContactRouter = (basePath: string) => {
    const contactRouter = express.Router();
    contactRouter.use(accessValidation);
    contactRouter.post(`${basePath}/contact`, ContactController.create);

    return contactRouter;
}