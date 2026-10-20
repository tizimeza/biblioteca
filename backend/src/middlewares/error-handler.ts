import { ErrorRequestHandler } from 'express';
import { HTTP_STATUS } from '../constants/http';
import { MESSAGES } from '../constants/messages';
import { logger } from '../config/logger';
import { AppError } from '../utils/AppError';

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error instanceof AppError) {
    if (error.statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      logger.error(error.message, { stack: error.stack, details: error.details });
    } else {
      logger.warn(error.message, { statusCode: error.statusCode, details: error.details });
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

  logger.error('Unhandled application error', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
  response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      message: MESSAGES.INTERNAL_SERVER_ERROR,
      details: null,
    },
  });
};
