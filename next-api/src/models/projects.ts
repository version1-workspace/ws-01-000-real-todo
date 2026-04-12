import { Prisma, prisma } from './prisma.js';

export const projectsModel = {
  findByUuid(uuid: string) {
    return prisma.project.findUnique({ where: { uuid } });
  },

  findBySlug(userId: number, slug: string) {
    return prisma.project.findFirst({
      where: { userId, slug },
    });
  },

  findMany(args: Prisma.ProjectFindManyArgs) {
    return prisma.project.findMany(args);
  },

  count(args: Prisma.ProjectCountArgs) {
    return prisma.project.count(args);
  },

  create(args: Prisma.ProjectCreateArgs) {
    return prisma.project.create(args);
  },

  update(args: Prisma.ProjectUpdateArgs) {
    return prisma.project.update(args);
  },
};
