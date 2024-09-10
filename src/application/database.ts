import { PrismaClient } from "@prisma/client";
import logger from "./logger";

export const prismaClientSingleton = () => {
    const prismaClient = new PrismaClient({
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

    prismaClient.$on("query", (e) => { logger.info(e) });
    prismaClient.$on("error", (e) => { logger.error(e) });
    prismaClient.$on("info", (e) => { logger.info(e) });
    prismaClient.$on("warn", (e) => { logger.warn(e) });

    return prismaClient;
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
