import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ObjectSchema, ValidationError } from 'yup';
import { HTTP_STATUS } from '../constants/http';
import { MESSAGES } from '../constants/messages';
import { AppError } from '../utils/AppError';

export function validate(schema: ObjectSchema<Record<string, unknown>>): RequestHandler {
  return async (request: Request, _response: Response, next: NextFunction) => {
    try {
      request.body = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      next();
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        next(new AppError(
          MESSAGES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST,
          error.errors,
        ));
        return;
      }
      next(error);
    }
  };
}
