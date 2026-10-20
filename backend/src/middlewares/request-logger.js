"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_1 = require("../config/logger");
const messages_1 = require("../constants/messages");
const requestLogger = (request, response, next) => {
    const startedAt = process.hrtime.bigint();
    response.on('finish', () => {
        const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1000000;
        logger_1.logger.info(messages_1.MESSAGES.HTTP_REQUEST, {
            method: request.method,
            path: request.originalUrl,
            status: response.statusCode,
            durationMs: Math.round(elapsedMs * 100) / 100,
        });
    });
    next();
};
exports.requestLogger = requestLogger;
