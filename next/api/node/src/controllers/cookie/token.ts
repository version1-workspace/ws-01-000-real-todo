import type { Request, Response } from "express";

const COOKIE_KEYS = {
	REFRESH_TOKEN: "refreshToken",
} as const;

const isProduction = process.env.NODE_ENV === "production";
const REFRESH_TOKEN_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

const cookieOptions = {
	httpOnly: true,
	...(isProduction
		? { secure: true, sameSite: "none" as const }
		: { secure: false }),
};

export const tokenCookie = {
	getRefreshToken(req: Request): string | undefined {
		return req.cookies?.[COOKIE_KEYS.REFRESH_TOKEN];
	},

	setRefreshToken(res: Response, token: string, rememberMe: boolean) {
		res.cookie(COOKIE_KEYS.REFRESH_TOKEN, token, {
			...cookieOptions,
			...(rememberMe ? { maxAge: REFRESH_TOKEN_MAX_AGE_MS } : {}),
		});
	},

	clearAll(res: Response) {
		res.clearCookie(COOKIE_KEYS.REFRESH_TOKEN, cookieOptions);
	},
};
