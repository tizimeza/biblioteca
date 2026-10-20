import { RequestHandler } from 'express';
import { HTTP_STATUS } from '../constants/http';
import { MESSAGES } from '../constants/messages';
import { login } from '../services/auth.service';

export const loginController: RequestHandler = async (request, response, next) => {
  try {
    const result = await login(request.body as { username: string; password: string });
    response.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: MESSAGES.LOGIN_SUCCESS,
    });
  } catch (error: unknown) {
    next(error);
  }
};
