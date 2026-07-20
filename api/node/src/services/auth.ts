import { refreshTokenPolicy } from "../config/auth.js";
import { signAccessToken } from "../lib/auth.js";
import { HttpError } from "../lib/http-error.js";
import { comparePassword, generateRefreshToken } from "../lib/password.js";
import type { User } from "../models/prisma.js";
import { usersModel } from "../models/users.js";

type AuthUser = Pick<User, "id" | "uuid" | "username">;

const createRefreshTokenExpiresAt = () => {
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + refreshTokenPolicy.expiresInDays);
	return expiresAt;
};

const isExpired = (date: Date | null) => {
	if (!date) {
		return true;
	}

	return date.getTime() <= Date.now();
};

export const authService = {
	async login(email: string, password: string, rememberMe = false) {
		const user = await usersModel.findByEmail(email);
		if (!user) {
			throw new HttpError(401, "Unauthorized");
		}

		const ok = await comparePassword(password, user.password);
		if (!ok) {
			throw new HttpError(401, "Unauthorized");
		}

		return this.issueTokens(user, rememberMe);
	},

	async refresh(refreshToken: string | undefined) {
		if (!refreshToken) {
			throw new HttpError(401, "invalid refresh token");
		}

		const user = await usersModel.findByRefreshToken(refreshToken);
		if (!user) {
			throw new HttpError(401, "invalid refresh token");
		}

		if (isExpired(user.refreshTokenExpiresAt)) {
			await usersModel.clearRefreshToken(user.id);
			throw new HttpError(401, "invalid refresh token");
		}

		return this.issueTokens(user, user.refreshTokenRememberMe);
	},

	async issueTokens(user: AuthUser, rememberMe = false) {
		const refreshToken = await generateRefreshToken();
		const updated = await usersModel.updateRefreshToken(
			user.id,
			refreshToken,
			createRefreshTokenExpiresAt(),
			rememberMe,
		);

		return {
			uuid: user.uuid,
			accessToken: signAccessToken({
				sub: user.username,
			}),
			refreshToken: updated.refreshToken,
			rememberMe,
		};
	},

	async revokeRefreshToken(refreshToken: string | undefined) {
		if (!refreshToken) {
			return;
		}

		const user = await usersModel.findByRefreshToken(refreshToken);
		if (!user) {
			return;
		}

		await usersModel.clearRefreshToken(user.id);
	},
};
