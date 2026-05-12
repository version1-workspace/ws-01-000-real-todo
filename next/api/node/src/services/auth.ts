import { signAccessToken } from "../lib/auth.js";
import { HttpError } from "../lib/http-error.js";
import { comparePassword, generateRefreshToken } from "../lib/password.js";
import { prisma } from "../models/prisma.js";
import { usersModel } from "../models/users.js";

const REFRESH_TOKEN_EXPIRES_IN_DAYS = 14;

const createRefreshTokenExpiresAt = () => {
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);
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

		return this.issueTokens(user.id, rememberMe);
	},

	async refresh(refreshToken: string | undefined) {
		if (!refreshToken) {
			throw new HttpError(401, "invalid refresh token");
		}

		const user = await usersModel.findByRefreshToken(refreshToken);
		if (!user || user.refreshToken !== refreshToken) {
			throw new HttpError(401, "invalid refresh token");
		}

		if (isExpired(user.refreshTokenExpiresAt)) {
			await usersModel.updateRefreshToken(user.id, "", null, false);
			throw new HttpError(401, "invalid refresh token");
		}

		return this.issueTokens(user.id, user.refreshTokenRememberMe);
	},

	async issueTokens(userId: number, rememberMe = false) {
		const user = await prisma.user.findUniqueOrThrow({
			where: { id: userId },
		});
		const refreshToken = await generateRefreshToken();
		const updated = await usersModel.updateRefreshToken(
			user.id,
			refreshToken,
			createRefreshTokenExpiresAt(),
			rememberMe,
		);

		return {
			uuid: updated.uuid,
			accessToken: signAccessToken({
				sub: updated.username,
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

		await usersModel.updateRefreshToken(user.id, "", null, false);
	},
};
