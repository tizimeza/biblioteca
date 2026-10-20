import 'dotenv/config';
import { app } from './app';
import { AppDataSource } from './config/data-source';
import { logger } from './config/logger';
import { MESSAGES } from './constants/messages';
import { seedAdmin } from './services/auth.service';

async function startServer(): Promise<void> {
  const portValue = process.env.PORT ?? '3000';
  const port = Number(portValue);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('La variable de entorno PORT debe ser un puerto válido.');
  }

  await AppDataSource.initialize();
  await seedAdmin();
  app.listen(port, () => {
    logger.info(MESSAGES.SERVER_STARTED, { port });
  });
}

void startServer().catch((error: unknown) => {
  logger.error(MESSAGES.SERVER_START_FAILED, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
  process.exitCode = 1;
});
