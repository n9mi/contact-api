"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonSingleton = void 0;
const winston_1 = __importDefault(require("winston"));
const winstonSingleton = () => winston_1.default.createLogger({
    level: "debug",
    format: winston_1.default.format.json(),
    transports: [
        new winston_1.default.transports.Console({})
    ]
});
exports.winstonSingleton = winstonSingleton;
const logger = (_a = globalThis.winstonGlobal) !== null && _a !== void 0 ? _a : (0, exports.winstonSingleton)();
exports.default = logger;
