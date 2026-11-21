import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  // Server
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  
  // Security
  CORS_ORIGIN: z.string().default('*'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
});

const parsedConfig = configSchema.safeParse(process.env);

if (!parsedConfig.success) {
  console.error('❌ Invalid environment configuration:');
  console.error(parsedConfig.error.errors.map(err => `  - ${err.path.join('.')}: ${err.message}`).join('\n'));
  process.exit(1);
}

export const config = parsedConfig.data;

export default config;