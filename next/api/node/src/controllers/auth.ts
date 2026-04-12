import { Request, Response } from 'express';
import { z } from 'zod';
import { HttpError } from '../lib/http-error.js';
import { authService } from '../services/auth.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

const refreshSchema = z.object({
  uuid: z.string().uuid(),
});

const cookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: 'none' as const,
};

export const authController = {
  async login(req: Request, res: Response) {
    const body = loginSchema.parse(req.body);
    const data = await authService.login(body.email, body.password);

    if (body.rememberMe) {
      res.cookie('refreshToken', data.refreshToken, cookieOptions);
    }

    res.json({ data });
  },

  async refresh(req: Request, res: Response) {
    const body = refreshSchema.parse(req.body);
    try {
      const data = await authService.refresh(body.uuid, req.cookies.refreshToken);
      res.cookie('refreshToken', data.refreshToken, cookieOptions);
      res.json({ data });
    } catch (error) {
      if (error instanceof HttpError && error.statusCode === 401) {
        res.status(401).json({ message: error.message });
        return;
      }
      throw error;
    }
  },

  clearRefresh(_req: Request, res: Response) {
    res.clearCookie('refreshToken', cookieOptions);
    res.status(200).send();
  },
};
