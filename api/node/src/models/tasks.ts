import { type Prisma, prisma } from "./prisma.js";

export const taskInclude = {
	project: true,
	parent: true,
	children: true,
	tagTasks: {
		include: {
			tag: true,
		},
	},
} satisfies Prisma.TaskInclude;

export const tasksModel = {
	findFirst<T extends Prisma.TaskFindFirstArgs>(
		args: Prisma.SelectSubset<T, Prisma.TaskFindFirstArgs>,
	) {
		return prisma.task.findFirst(args);
	},

	findMany<T extends Prisma.TaskFindManyArgs>(
		args: Prisma.SelectSubset<T, Prisma.TaskFindManyArgs>,
	) {
		return prisma.task.findMany(args);
	},

	count(args: Prisma.TaskCountArgs) {
		return prisma.task.count(args);
	},

	createMany(args: Prisma.TaskCreateManyArgs) {
		return prisma.task.createMany(args);
	},

	create<T extends Prisma.TaskCreateArgs>(
		args: Prisma.SelectSubset<T, Prisma.TaskCreateArgs>,
	) {
		return prisma.task.create(args);
	},

	update<T extends Prisma.TaskUpdateArgs>(
		args: Prisma.SelectSubset<T, Prisma.TaskUpdateArgs>,
	) {
		return prisma.task.update(args);
	},

	updateMany(args: Prisma.TaskUpdateManyArgs) {
		return prisma.task.updateMany(args);
	},
};
