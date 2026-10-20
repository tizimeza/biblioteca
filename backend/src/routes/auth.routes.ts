import { Router } from 'express';
import { loginController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../validators/auth.validator';

export const authRoutes = Router();

authRoutes.post('/login', validate(loginSchema), loginController);
