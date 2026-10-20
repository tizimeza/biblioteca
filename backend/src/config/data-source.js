"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
require("dotenv/config");
const typeorm_1 = require("typeorm");
const messages_1 = require("../constants/messages");
const Autor_1 = require("../entities/Autor");
const Estante_1 = require("../entities/Estante");
const Genero_1 = require("../entities/Genero");
const Libro_1 = require("../entities/Libro");
const Saga_1 = require("../entities/Saga");
const Usuario_1 = require("../entities/Usuario");
function requiredEnv(name, allowEmpty = false) {
    const value = process.env[name];
    if (value === undefined || (!allowEmpty && !value)) {
        throw new Error(`${messages_1.MESSAGES.ENV_CONFIGURATION_ERROR} ${name}.`);
    }
    return value;
}
function parsePort(name) {
    const value = Number(requiredEnv(name));
    if (!Number.isInteger(value) || value < 1 || value > 65535) {
        throw new Error(`La variable de entorno ${name} ${messages_1.MESSAGES.INVALID_PORT}`);
    }
    return value;
}
const isDevelopment = process.env.NODE_ENV === 'development';
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: requiredEnv('DB_HOST'),
    port: parsePort('DB_PORT'),
    username: requiredEnv('DB_USER'),
    password: requiredEnv('DB_PASSWORD', true),
    database: requiredEnv('DB_NAME'),
    entities: [Usuario_1.Usuario, Autor_1.Autor, Genero_1.Genero, Saga_1.Saga, Estante_1.Estante, Libro_1.Libro],
    synchronize: isDevelopment,
    logging: isDevelopment,
});
