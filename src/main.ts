import logger from "./application/logger";
import { web } from "./application/web";
import dotenv from "dotenv";

dotenv.config();

const APP_PORT = process.env.PORT;

web.listen(APP_PORT, () => { logger.info(`Listening into ${APP_PORT}`) });