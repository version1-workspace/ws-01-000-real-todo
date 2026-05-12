import type { Request, Response } from "express";
import { z } from "zod";
import { HttpError } from "../lib/http-error.js";
import { authService } from "../services/auth.js";
import { tokenCookie } from "./cookie/token.js";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
	rememberMe: z.boolean().optional(),
});

type AuthResult = Awaited<ReturnType<typeof authService.login>>;

const toAuthTokenResponse = (
	data: Pick<AuthResult, "uuid" | "accessToken">,
) => ({
	uuid: data.uuid,
	accessToken: data.accessToken,
});

export const authController = {
	async login(req: Request, res: Response) {
		const body = loginSchema.parse(req.body);
		const rememberMe = Boolean(body.rememberMe);
		const data = await authService.login(body.email, body.password, rememberMe);

		tokenCookie.setRefreshToken(res, data.refreshToken, rememberMe);

		res.json({ data: toAuthTokenResponse(data) });
	},

	async refresh(req: Request, res: Response) {
		try {
			const data = await authService.refresh(tokenCookie.getRefreshToken(req));
			tokenCookie.setRefreshToken(res, data.refreshToken, data.rememberMe);
			res.json({ data: toAuthTokenResponse(data) });
		} catch (error) {
			if (error instanceof HttpError && error.statusCode === 401) {
				tokenCookie.clearAll(res);
				res.status(401).json({ message: error.message });
				return;
			}
			throw error;
		}
	},

	async clearRefresh(req: Request, res: Response) {
		await authService.revokeRefreshToken(tokenCookie.getRefreshToken(req));
		tokenCookie.clearAll(res);
		res.status(200).send();
	},
};
