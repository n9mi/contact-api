"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClientSingleton = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("./logger"));
const prismaClientSingleton = () => {
    const prismaClient = new client_1.PrismaClient({
        log: [
            {
                emit: "event",
                level: "query"
            },
            {
                emit: "event",
                level: "error"
            },
            {
                emit: "event",
                level: "info"
            },
            {
                emit: "event",
                level: "warn"
            }
        ]
    });
    prismaClient.$on("query", (e) => { logger_1.default.info(e); });
    prismaClient.$on("error", (e) => { logger_1.default.error(e); });
    prismaClient.$on("info", (e) => { logger_1.default.info(e); });
    prismaClient.$on("warn", (e) => { logger_1.default.warn(e); });
    return prismaClient;
};
exports.prismaClientSingleton = prismaClientSingleton;
const prisma = (_a = globalThis.prismaGlobal) !== null && _a !== void 0 ? _a : (0, exports.prismaClientSingleton)();
exports.default = prisma;
