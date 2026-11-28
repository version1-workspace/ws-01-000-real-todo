import type { Request, Response } from "express";
import { refreshTokenPolicy } from "../../config/auth.js";

const COOKIE_KEYS = {
	REFRESH_TOKEN: "refreshToken",
} as const;

export const createCookieOptions = (isProduction: boolean) => ({
	httpOnly: true,
	sameSite: "lax" as const,
	secure: isProduction,
});

const cookieOptions = createCookieOptions(
	process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_APP_ENV === "production",
);

export const tokenCookie = {
	getRefreshToken(req: Request): string | undefined {
		return req.cookies?.[COOKIE_KEYS.REFRESH_TOKEN];
	},

	setRefreshToken(res: Response, token: string, rememberMe: boolean) {
		res.cookie(COOKIE_KEYS.REFRESH_TOKEN, token, {
			...cookieOptions,
			...(rememberMe ? { maxAge: refreshTokenPolicy.maxAgeMs } : {}),
		});
	},

	clearAll(res: Response) {
		res.clearCookie(COOKIE_KEYS.REFRESH_TOKEN, cookieOptions);
	},
};
