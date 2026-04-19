import type { Request, Response } from "express";

const COOKIE_KEYS = {
	ACCESS_TOKEN: "accessToken",
	REFRESH_TOKEN: "refreshToken",
} as const;

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
	httpOnly: true,
	...(isProduction
		? { secure: true, sameSite: "none" as const }
		: { secure: false }),
};

export const tokenCookie = {
	getAccessToken(req: Request): string | undefined {
		return req.cookies?.[COOKIE_KEYS.ACCESS_TOKEN];
	},

	getRefreshToken(req: Request): string | undefined {
		return req.cookies?.[COOKIE_KEYS.REFRESH_TOKEN];
	},

	setAccessToken(res: Response, token: string) {
		res.cookie(COOKIE_KEYS.ACCESS_TOKEN, token, cookieOptions);
	},

	setRefreshToken(res: Response, token: string) {
		res.cookie(COOKIE_KEYS.REFRESH_TOKEN, token, cookieOptions);
	},

	clearAll(res: Response) {
		res.clearCookie(COOKIE_KEYS.ACCESS_TOKEN, cookieOptions);
		res.clearCookie(COOKIE_KEYS.REFRESH_TOKEN, cookieOptions);
	},
};
