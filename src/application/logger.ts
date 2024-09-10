import winston from "winston";

export const winstonSingleton = () => 
    winston.createLogger({
        level: "debug",
        format: winston.format.json(),
        transports: [
            new winston.transports.Console({})
        ]
    })

declare const globalThis: {
    winstonGlobal: ReturnType<typeof winstonSingleton>; 
} & typeof global;

const logger = globalThis.winstonGlobal ?? winstonSingleton();

export default logger;