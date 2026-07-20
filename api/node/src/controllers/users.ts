import type { Response } from "express";
import { serializeUser } from "../lib/serializers.js";
import type { AuthenticatedRequest } from "../middlewares/auth.js";

export const usersController = {
	me(req: AuthenticatedRequest, res: Response) {
		res.json({
			data: serializeUser(req.currentUser!),
		});
	},
};
