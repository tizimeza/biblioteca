"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const data_source_1 = require("./config/data-source");
const logger_1 = require("./config/logger");
const messages_1 = require("./constants/messages");
const auth_service_1 = require("./services/auth.service");
async function startServer() {
    const portValue = process.env.PORT ?? '3000';
    const port = Number(portValue);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('La variable de entorno PORT debe ser un puerto válido.');
    }
    await data_source_1.AppDataSource.initialize();
    await (0, auth_service_1.seedAdmin)();
    app_1.app.listen(port, () => {
        logger_1.logger.info(messages_1.MESSAGES.SERVER_STARTED, { port });
    });
}
void startServer().catch((error) => {
    logger_1.logger.error(messages_1.MESSAGES.SERVER_START_FAILED, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
    });
    process.exitCode = 1;
});
