import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { HTTP_STATUS } from '../constants/http';
import { MESSAGES } from '../constants/messages';
import { Usuario } from '../entities/Usuario';
import { AppError } from '../utils/AppError';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResult {
  token: string;
}

const BCRYPT_ROUNDS = 12;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${MESSAGES.ENV_MISSING} ${name}.`);
  }
  return value;
}

function parseTokenExpiration(value: string): number {
  const match = /^(\d+)(s|m|h|d)$/.exec(value);
  if (!match) {
    throw new Error(MESSAGES.JWT_EXPIRATION_FORMAT);
  }

  const amount = Number(match[1]);
  const secondsPerUnit = { s: 1, m: 60, h: 3600, d: 86400 }[match[2] as 's' | 'm' | 'h' | 'd'];
  const seconds = amount * secondsPerUnit;
  if (!Number.isSafeInteger(seconds) || seconds <= 0) {
    throw new Error(MESSAGES.JWT_EXPIRATION_INVALID);
  }
  return seconds;
}

export async function seedAdmin(): Promise<void> {
  const username = requiredEnv('ADMIN_USER');
  const password = requiredEnv('ADMIN_PASSWORD');
  const repository = AppDataSource.getRepository(Usuario);
  const existingAdmin = await repository.findOneBy({ username });

  if (existingAdmin) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await repository.save(repository.create({ username, password: passwordHash }));
}

export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  const repository = AppDataSource.getRepository(Usuario);
  const usuario = await repository.findOneBy({ username: credentials.username });
  const passwordHash = usuario?.password ?? await bcrypt.hash(requiredEnv('ADMIN_PASSWORD'), BCRYPT_ROUNDS);
  const passwordMatches = await bcrypt.compare(credentials.password, passwordHash);

  if (!usuario || !passwordMatches) {
    throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  const secret = requiredEnv('JWT_SECRET');
  const expiresIn = parseTokenExpiration(requiredEnv('JWT_EXPIRES_IN'));
  const token = jwt.sign(
    { username: usuario.username },
    secret,
    { subject: String(usuario.id), expiresIn },
  );

  return { token };
}
