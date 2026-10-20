"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_1 = require("../constants/http");
const messages_1 = require("../constants/messages");
const routes_1 = require("../constants/routes");
const AppError_1 = require("../utils/AppError");
function requiredSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error(`${messages_1.MESSAGES.ENV_CONFIGURATION_ERROR} JWT_SECRET.`);
    }
    return secret;
}
function authMiddleware(request, _response, next) {
    const authorization = request.header('Authorization');
    const token = authorization?.startsWith(routes_1.AUTHORIZATION.BEARER_PREFIX)
        ? authorization.slice(routes_1.AUTHORIZATION.BEARER_PREFIX.length)
        : undefined;
    if (!token) {
        next(new AppError_1.AppError(messages_1.MESSAGES.TOKEN_REQUIRED, http_1.HTTP_STATUS.UNAUTHORIZED));
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, requiredSecret());
        if (typeof payload === 'string' || !payload.sub || !/^\d+$/.test(payload.sub)) {
            next(new AppError_1.AppError(messages_1.MESSAGES.INVALID_TOKEN, http_1.HTTP_STATUS.UNAUTHORIZED));
            return;
        }
        const claims = payload;
        request.usuario = {
            id: Number(payload.sub),
            username: claims.username ?? '',
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError || error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new AppError_1.AppError(messages_1.MESSAGES.INVALID_TOKEN, http_1.HTTP_STATUS.UNAUTHORIZED));
            return;
        }
        next(error);
    }
}
