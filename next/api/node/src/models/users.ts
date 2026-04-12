import { prisma } from './prisma.js';

export const usersModel = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findByUuid(uuid: string) {
    return prisma.user.findUnique({ where: { uuid } });
  },

  findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },

  updateRefreshToken(id: number, refreshToken: string) {
    return prisma.user.update({
      where: { id },
      data: {
        refreshToken,
        updatedAt: new Date(),
      },
    });
  },
};
