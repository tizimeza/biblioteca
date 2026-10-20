"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const http_1 = require("../constants/http");
const messages_1 = require("../constants/messages");
const AppError_1 = require("../utils/AppError");
const notFound = (request, _response, next) => {
    next(new AppError_1.AppError(messages_1.MESSAGES.ROUTE_NOT_FOUND, http_1.HTTP_STATUS.NOT_FOUND, { method: request.method, path: request.originalUrl }));
};
exports.notFound = notFound;
