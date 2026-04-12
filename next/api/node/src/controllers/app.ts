import type { Request, Response } from 'express';

export const appController = {
  version(_req: Request, res: Response) {
    res.json({ version: 'v1' });
  },
};
