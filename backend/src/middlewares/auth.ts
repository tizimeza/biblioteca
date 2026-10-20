import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HTTP_STATUS } from '../constants/http';
import { MESSAGES } from '../constants/messages';
import { AUTHORIZATION } from '../constants/routes';
import { AppError } from '../utils/AppError';

function requiredSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Falta configurar la variable de entorno JWT_SECRET.');
  }
  return secret;
}

export function authMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  const authorization = request.header('Authorization');
  const token = authorization?.startsWith(AUTHORIZATION.BEARER_PREFIX)
    ? authorization.slice(AUTHORIZATION.BEARER_PREFIX.length)
    : undefined;

  if (!token) {
    next(new AppError(MESSAGES.TOKEN_REQUIRED, HTTP_STATUS.UNAUTHORIZED));
    return;
  }

  try {
    const payload = jwt.verify(token, requiredSecret());
    if (typeof payload === 'string' || !payload.sub || !/^\d+$/.test(payload.sub)) {
      next(new AppError(MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    const claims = payload as JwtPayload & { username?: string };
    request.usuario = {
      id: Number(payload.sub),
      username: claims.username ?? '',
    };
    next();
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
      next(new AppError(MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED));
      return;
    }
    next(error);
  }
}
