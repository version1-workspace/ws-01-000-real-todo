import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().min(1),
  ALLOW_REQUEST_URL: z.string().default('http://localhost:3000'),
  AUTH_SECRET: z.string().min(1),
  AUTH_SUGAR: z.string().default('real-todo-sugar'),
  JWT_EXPIRES_IN: z.string().default('30m'),
});

export const env = envSchema.parse(process.env);
