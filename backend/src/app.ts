import express from 'express';
import cors from 'cors';
import { API_PREFIX, AUTH_ROUTES } from './constants/routes';
import { errorHandler } from './middlewares/error-handler';
import { notFound } from './middlewares/not-found';
import { requestLogger } from './middlewares/request-logger';
import { authMiddleware } from './middlewares/auth';
import { authRoutes } from './routes/auth.routes';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(`${API_PREFIX}${AUTH_ROUTES.BASE}`, authRoutes);
app.use(API_PREFIX, authMiddleware);
app.use(notFound);
app.use(errorHandler);
