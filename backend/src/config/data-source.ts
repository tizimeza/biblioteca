import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Autor } from '../entities/Autor';
import { Estante } from '../entities/Estante';
import { Genero } from '../entities/Genero';
import { Libro } from '../entities/Libro';
import { Saga } from '../entities/Saga';
import { Usuario } from '../entities/Usuario';

function requiredEnv(name: string, allowEmpty = false): string {
  const value = process.env[name];
  if (value === undefined || (!allowEmpty && !value)) {
    throw new Error(`Falta configurar la variable de entorno ${name}.`);
  }
  return value;
}

function parsePort(name: string): number {
  const value = Number(requiredEnv(name));
  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`La variable de entorno ${name} debe ser un puerto válido.`);
  }
  return value;
}

const isDevelopment = process.env.NODE_ENV === 'development';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: requiredEnv('DB_HOST'),
  port: parsePort('DB_PORT'),
  username: requiredEnv('DB_USER'),
  password: requiredEnv('DB_PASSWORD', true),
  database: requiredEnv('DB_NAME'),
  entities: [Usuario, Autor, Genero, Saga, Estante, Libro],
  synchronize: isDevelopment,
  logging: isDevelopment,
});
