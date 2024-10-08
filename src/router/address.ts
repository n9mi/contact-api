import express from "express";
import { accessValidation } from "../middleware/accessValidation";
import { AddressController } from "../controller/address";

export const getAddressRouter = (basePath: string) => {
    const addressRouter = express.Router();
    addressRouter.use(accessValidation);
    addressRouter.get(`${basePath}/contacts/:contactId/addresses`, AddressController.getAll);
    addressRouter.post(`${basePath}/contacts/:contactId/addresses`, AddressController.create);
    addressRouter.put(`${basePath}/contacts/:contactId/addresses/:addressId`, AddressController.update);
    addressRouter.delete(`${basePath}/contacts/:contactId/addresses/:addressId`, AddressController.delete);

    return addressRouter;
}