import { RequestHandler } from 'express';
import { HTTP_STATUS } from '../constants/http';
import { MESSAGES } from '../constants/messages';
import { AppError } from '../utils/AppError';

export const notFound: RequestHandler = (request, _response, next) => {
  next(new AppError(
    MESSAGES.ROUTE_NOT_FOUND,
    HTTP_STATUS.NOT_FOUND,
    { method: request.method, path: request.originalUrl },
  ));
};
