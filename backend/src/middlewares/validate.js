"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const yup_1 = require("yup");
const http_1 = require("../constants/http");
const messages_1 = require("../constants/messages");
const AppError_1 = require("../utils/AppError");
function validate(schema) {
    return async (request, _response, next) => {
        try {
            request.body = await schema.validate(request.body, {
                abortEarly: false,
                stripUnknown: true,
            });
            next();
        }
        catch (error) {
            if (error instanceof yup_1.ValidationError) {
                next(new AppError_1.AppError(messages_1.MESSAGES.VALIDATION_ERROR, http_1.HTTP_STATUS.BAD_REQUEST, error.errors));
                return;
            }
            next(error);
        }
    };
}
