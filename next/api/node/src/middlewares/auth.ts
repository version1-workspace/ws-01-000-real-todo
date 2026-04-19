import type { NextFunction, Request, Response } from "express";
import { tokenCookie } from "../controllers/cookie/token.js";
import { verifyAccessToken } from "../lib/auth.js";
import { HttpError } from "../lib/http-error.js";
import { usersModel } from "../models/users.js";

export interface AuthenticatedRequest extends Request {
  currentUser?: Awaited<ReturnType<typeof usersModel.findByUsername>>;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const [type, headerToken] = req.headers.authorization?.split(" ") ?? [];
  const headerTokenExists = Boolean(type === "Bearer" && headerToken);
  const cookieToken = tokenCookie.getAccessToken(req);
  const token = headerTokenExists ? headerToken : cookieToken;
  if (!token) {
    console.log("No token found in Authorization header or cookies");
    next(
      new HttpError(
        401,
        "Unauthorized: Missing or invalid Authorization header",
      ),
    );
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await usersModel.findByUsername(payload.sub);
    if (!user) {
      throw new HttpError(401, "Unauthorized");
    }

    req.currentUser = user;
    next();
  } catch (_error) {
    console.log(
      "Authentication failed:",
      _error instanceof Error ? _error.message : _error,
    );
    next(new HttpError(401, "Unauthorized"));
  }
};
