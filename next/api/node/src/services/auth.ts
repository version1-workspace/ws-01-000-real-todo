import { comparePassword, generateRefreshToken } from "../lib/password.js";
import { signAccessToken } from "../lib/auth.js";
import { HttpError } from "../lib/http-error.js";
import { usersModel } from "../models/users.js";
import { prisma } from "../models/prisma.js";

export const authService = {
  async login(email: string, password: string) {
    const user = await usersModel.findByEmail(email);
    if (!user) {
      throw new HttpError(401, "Unauthorized");
    }

    const ok = await comparePassword(password, user.password);
    if (!ok) {
      throw new HttpError(401, "Unauthorized");
    }

    return this.issueTokens(user.id);
  },

  async refresh(uuid: string, refreshToken: string | undefined) {
    const user = await usersModel.findByUuid(uuid);
    if (!user || !refreshToken || user.refreshToken !== refreshToken) {
      throw new HttpError(401, "invalid refresh token or uuid");
    }

    return this.issueTokens(user.id);
  },

  async issueTokens(userId: number) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    const refreshToken = await generateRefreshToken();
    const updated = await usersModel.updateRefreshToken(user.id, refreshToken);

    return {
      uuid: updated.uuid,
      accessToken: signAccessToken({
        sub: updated.username,
        refreshToken: updated.refreshToken,
      }),
      refreshToken: updated.refreshToken,
    };
  },
};
