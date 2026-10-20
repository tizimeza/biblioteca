"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const winston_1 = require("winston");
const log_levels_1 = require("../constants/log-levels");
const logsDirectory = node_path_1.default.resolve(process.cwd(), 'logs');
node_fs_1.default.mkdirSync(logsDirectory, { recursive: true });
const logFormat = winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.json());
exports.logger = (0, winston_1.createLogger)({
    level: process.env.LOG_LEVEL ?? log_levels_1.LOG_LEVELS.INFO,
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
    },
    format: logFormat,
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({
            filename: node_path_1.default.join(logsDirectory, 'app.log'),
        }),
        new winston_1.transports.File({
            filename: node_path_1.default.join(logsDirectory, 'error.log'),
            level: log_levels_1.LOG_LEVELS.ERROR,
        }),
    ],
});
