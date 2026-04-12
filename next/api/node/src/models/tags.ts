import { type Prisma, prisma } from './prisma.js';

export const tagsModel = {
  findMany(args: Prisma.TagFindManyArgs) {
    return prisma.tag.findMany(args);
  },

  count(args: Prisma.TagCountArgs) {
    return prisma.tag.count(args);
  },
};
