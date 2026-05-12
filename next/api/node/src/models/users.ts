import { prisma } from "./prisma.js";

export const usersModel = {
	findByEmail(email: string) {
		return prisma.user.findUnique({ where: { email } });
	},

	findByUsername(username: string) {
		return prisma.user.findUnique({ where: { username } });
	},

	findByRefreshToken(refreshToken: string) {
		return prisma.user.findFirst({ where: { refreshToken } });
	},

	updateRefreshToken(
		id: number,
		refreshToken: string,
		refreshTokenExpiresAt: Date | null,
		refreshTokenRememberMe: boolean,
	) {
		return prisma.user.update({
			where: { id },
			data: {
				refreshToken,
				refreshTokenExpiresAt,
				refreshTokenRememberMe,
				updatedAt: new Date(),
			},
		});
	},

	clearRefreshToken(id: number) {
		return this.updateRefreshToken(id, "", null, false);
	},
};
