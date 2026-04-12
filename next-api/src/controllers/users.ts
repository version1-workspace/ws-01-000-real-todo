import { Response } from 'express';
import { serializeUser } from '../lib/serializers.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

export const usersController = {
  me(req: AuthenticatedRequest, res: Response) {
    res.json({
      data: serializeUser(req.currentUser!),
    });
  },
};
