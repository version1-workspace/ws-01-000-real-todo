import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../lib/auth.js';
import { HttpError } from '../lib/http-error.js';
import { usersModel } from '../models/users.js';

export interface AuthenticatedRequest extends Request {
  currentUser?: Awaited<ReturnType<typeof usersModel.findByUsername>>;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const [type, token] = req.headers.authorization?.split(' ') ?? [];
  if (type !== 'Bearer' || !token) {
    next(new HttpError(401, 'Unauthorized'));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await usersModel.findByUsername(payload.sub);
    if (!user) {
      throw new HttpError(401, 'Unauthorized');
    }

    req.currentUser = user;
    next();
  } catch (_error) {
    next(new HttpError(401, 'Unauthorized'));
  }
};
