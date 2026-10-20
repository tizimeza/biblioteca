"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_1 = require("../constants/http");
const messages_1 = require("../constants/messages");
const logger_1 = require("../config/logger");
const AppError_1 = require("../utils/AppError");
const MYSQL_DUPLICATE_ENTRY = 1062;
const MYSQL_RESTRICTED_DELETE = 1451;
function isMalformedJsonError(error) {
    return error instanceof SyntaxError
        && 'status' in error
        && error.status === http_1.HTTP_STATUS.BAD_REQUEST
        && 'body' in error;
}
const errorHandler = (error, _request, response, _next) => {
    if (isMalformedJsonError(error)) {
        logger_1.logger.warn(messages_1.MESSAGES.INVALID_JSON);
        response.status(http_1.HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: {
                message: messages_1.MESSAGES.INVALID_JSON,
                details: null,
            },
        });
        return;
    }
    if (error instanceof AppError_1.AppError) {
        if (error.statusCode >= http_1.HTTP_STATUS.INTERNAL_SERVER_ERROR) {
            logger_1.logger.error(error.message, { stack: error.stack, details: error.details });
        }
        else {
            logger_1.logger.warn(error.message, { statusCode: error.statusCode, details: error.details });
        }
        response.status(error.statusCode).json({
            success: false,
            error: {
                message: error.message,
                details: error.details ?? null,
            },
        });
        return;
    }
    const databaseCode = error?.driverError?.errno
        ?? error?.errno
        ?? error?.driverError?.code
        ?? error?.code;
    if (databaseCode === MYSQL_DUPLICATE_ENTRY || databaseCode === MYSQL_RESTRICTED_DELETE) {
        const isRestrictedDelete = databaseCode === MYSQL_RESTRICTED_DELETE;
        const message = isRestrictedDelete ? messages_1.MESSAGES.RESOURCE_IN_USE : messages_1.MESSAGES.DUPLICATE_RESOURCE;
        logger_1.logger.warn(message, { databaseCode });
        response.status(http_1.HTTP_STATUS.CONFLICT).json({
            success: false,
            error: { message, details: null },
        });
        return;
    }
    logger_1.logger.error(messages_1.MESSAGES.UNHANDLED_ERROR, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
    });
    response.status(http_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: {
            message: messages_1.MESSAGES.INTERNAL_SERVER_ERROR,
            details: null,
        },
    });
};
exports.errorHandler = errorHandler;
