import express from "express";
import { ContactController } from "../controller/contact";
import { accessValidation } from "../middleware/accessValidation";

export const getContactRouter = (basePath: string) => {
    const contactRouter = express.Router();
    contactRouter.use(accessValidation);
    contactRouter.get(`${basePath}/contacts`, ContactController.getAll);
    contactRouter.get(`${basePath}/contacts/:id`, ContactController.getById);
    contactRouter.post(`${basePath}/contacts`, ContactController.create);
    contactRouter.put(`${basePath}/contacts/:id`, ContactController.update);
    contactRouter.delete(`${basePath}/contacts/:id`, ContactController.delete);


    return contactRouter;
}