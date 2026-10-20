import { RequestHandler } from 'express';
import { logger } from '../config/logger';
import { MESSAGES } from '../constants/messages';

export const requestLogger: RequestHandler = (request, response, next) => {
  const startedAt = process.hrtime.bigint();

  response.on('finish', () => {
    const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    logger.info(MESSAGES.HTTP_REQUEST, {
      method: request.method,
      path: request.originalUrl,
      status: response.statusCode,
      durationMs: Math.round(elapsedMs * 100) / 100,
    });
  });

  next();
};
