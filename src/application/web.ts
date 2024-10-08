import express from "express";
import { getAuthRouter } from "../router/auth";
import { getErrorMiddleware } from "../middleware/error";
import dotenv from "dotenv";
import { getUserRouter } from "../router/user";
import { getContactRouter } from "../router/contact";
import { getAddressRouter } from "../router/address";

dotenv.config();
export const basePath = process.env.BASE_URL_PATH === undefined ? "/api/v1" : process.env.BASE_URL_PATH;

export const web = express();
web.use(express.json());
web.use(getAuthRouter(basePath));
web.use(getUserRouter(basePath));
web.use(getContactRouter(basePath));
web.use(getAddressRouter(basePath));
web.use(getErrorMiddleware());