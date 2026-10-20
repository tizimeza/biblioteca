import fs from 'node:fs';
import path from 'node:path';
import { createLogger, format, transports } from 'winston';
import { LOG_LEVELS } from '../constants/log-levels';

const logsDirectory = path.resolve(process.cwd(), 'logs');
fs.mkdirSync(logsDirectory, { recursive: true });

const logFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json(),
);

export const logger = createLogger({
  level: process.env.LOG_LEVEL ?? LOG_LEVELS.INFO,
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  format: logFormat,
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(logsDirectory, 'app.log'),
    }),
    new transports.File({
      filename: path.join(logsDirectory, 'error.log'),
      level: LOG_LEVELS.ERROR,
    }),
  ],
});
