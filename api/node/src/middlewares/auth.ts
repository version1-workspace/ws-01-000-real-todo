import type { NextFunction, Request, Response } from "express";
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
	if (type !== "Bearer" || !headerToken) {
		console.log("No token found in Authorization header");
		next(
			new HttpError(
				401,
				"Unauthorized: Missing or invalid Authorization header",
			),
		);
		return;
	}

	try {
		const payload = verifyAccessToken(headerToken);
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
