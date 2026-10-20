"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
exports.login = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../config/data-source");
const http_1 = require("../constants/http");
const messages_1 = require("../constants/messages");
const Usuario_1 = require("../entities/Usuario");
const AppError_1 = require("../utils/AppError");
const BCRYPT_ROUNDS = 12;
function requiredEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${messages_1.MESSAGES.ENV_MISSING} ${name}.`);
    }
    return value;
}
function parseTokenExpiration(value) {
    const match = /^(\d+)(s|m|h|d)$/.exec(value);
    if (!match) {
        throw new Error(messages_1.MESSAGES.JWT_EXPIRATION_FORMAT);
    }
    const amount = Number(match[1]);
    const secondsPerUnit = { s: 1, m: 60, h: 3600, d: 86400 }[match[2]];
    const seconds = amount * secondsPerUnit;
    if (!Number.isSafeInteger(seconds) || seconds <= 0) {
        throw new Error(messages_1.MESSAGES.JWT_EXPIRATION_INVALID);
    }
    return seconds;
}
async function seedAdmin() {
    const username = requiredEnv('ADMIN_USER');
    const password = requiredEnv('ADMIN_PASSWORD');
    const repository = data_source_1.AppDataSource.getRepository(Usuario_1.Usuario);
    const existingAdmin = await repository.findOneBy({ username });
    if (existingAdmin) {
        return;
    }
    const passwordHash = await bcrypt_1.default.hash(password, BCRYPT_ROUNDS);
    await repository.save(repository.create({ username, password: passwordHash }));
}
async function login(credentials) {
    const repository = data_source_1.AppDataSource.getRepository(Usuario_1.Usuario);
    const usuario = await repository.findOneBy({ username: credentials.username });
    const passwordHash = usuario?.password ?? await bcrypt_1.default.hash(requiredEnv('ADMIN_PASSWORD'), BCRYPT_ROUNDS);
    const passwordMatches = await bcrypt_1.default.compare(credentials.password, passwordHash);
    if (!usuario || !passwordMatches) {
        throw new AppError_1.AppError(messages_1.MESSAGES.INVALID_CREDENTIALS, http_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const secret = requiredEnv('JWT_SECRET');
    const expiresIn = parseTokenExpiration(requiredEnv('JWT_EXPIRES_IN'));
    const token = jsonwebtoken_1.default.sign({ username: usuario.username }, secret, { subject: String(usuario.id), expiresIn });
    return { token };
}
