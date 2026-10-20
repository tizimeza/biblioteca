"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const http_1 = require("../constants/http");
const messages_1 = require("../constants/messages");
const auth_service_1 = require("../services/auth.service");
const loginController = async (request, response, next) => {
    try {
        const result = await (0, auth_service_1.login)(request.body);
        response.status(http_1.HTTP_STATUS.OK).json({
            success: true,
            data: result,
            message: messages_1.MESSAGES.LOGIN_SUCCESS,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginController = loginController;
