const path = require('node:path');

const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const optionalInteger = (fallback, minimum = 0) =>
  z.coerce.number().int().min(minimum).default(fallback);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: optionalInteger(3037, 1).pipe(z.number().max(65535)),
  DB_HOST: z.string().min(1),
  DB_PORT: optionalInteger(3306, 1).pipe(z.number().max(65535)),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string().min(1),
  DB_CONNECTION_LIMIT: optionalInteger(10, 1).pipe(z.number().max(50)),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('8h'),
  CORS_ORIGINS: z.string().default('*'),
  LOW_STOCK_THRESHOLD: optionalInteger(5, 0),
  RATE_LIMIT_WINDOW_MS: optionalInteger(900000, 1000),
  RATE_LIMIT_MAX: optionalInteger(200, 1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');
  throw new Error(`Invalid environment configuration: ${details}`);
}

const env = Object.freeze({
  ...parsed.data,
  CORS_ORIGINS: parsed.data.CORS_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
});

module.exports = { env };
