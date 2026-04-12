import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signAccessToken = (payload: { sub: string; refreshToken: string }) =>
  jwt.sign(payload, env.AUTH_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.AUTH_SECRET) as { sub: string; refreshToken: string };
