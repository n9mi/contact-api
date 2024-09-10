"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./application/logger"));
const web_1 = require("./application/web");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const APP_PORT = process.env.PORT;
web_1.web.listen(APP_PORT, () => { logger_1.default.info(`Listening into ${APP_PORT}`); });
