import type { Request, Response } from "express";
import { z } from "zod";
import { HttpError } from "../lib/http-error.js";
import { tokenCookie } from "./cookie/token.js";
import { authService } from "../services/auth.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

const refreshSchema = z.object({
  uuid: z.string().uuid(),
});

export const authController = {
  async login(req: Request, res: Response) {
    const body = loginSchema.parse(req.body);
    const data = await authService.login(body.email, body.password);

    tokenCookie.setAccessToken(res, data.accessToken);
    if (body.rememberMe) {
      tokenCookie.setRefreshToken(res, data.refreshToken);
    }

    res.json({ data });
  },

  async refresh(req: Request, res: Response) {
    const body = refreshSchema.parse(req.body);
    try {
      const data = await authService.refresh(
        body.uuid,
        tokenCookie.getRefreshToken(req),
      );
      tokenCookie.setAccessToken(res, data.accessToken);
      tokenCookie.setRefreshToken(res, data.refreshToken);
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
    tokenCookie.clearAll(res);
    res.status(200).send();
  },
};
