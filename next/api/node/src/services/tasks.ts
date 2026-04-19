import crypto from "crypto";
import dayjs from "dayjs";
import { buildPageInfo } from "../lib/pagination.js";
import { HttpError } from "../lib/http-error.js";
import { projectsModel } from "../models/projects.js";
import { taskInclude, tasksModel } from "../models/tasks.js";
import { type Prisma, prisma } from "../models/prisma.js";

type TaskStatus = "initial" | "scheduled" | "completed" | "archived";
type TaskKind = "task" | "milestone";
type SortType = "deadline" | "startedAt" | "updatedAt" | "createdAt";

const toNullableDate = (value?: string | null) => {
	if (value === undefined) {
		return undefined;
	}
	if (value === null) {
		return null;
	}
	return new Date(value);
};

const sortFieldMap: Record<SortType, Prisma.TaskOrderByWithRelationInput> = {
	deadline: { deadline: "asc" },
	startedAt: { startedAt: "asc" },
	updatedAt: { updatedAt: "asc" },
	createdAt: { createdAt: "asc" },
};

export const tasksService = {
	async search(params: {
		userId: number;
		search?: string;
		projectId?: string;
		sortType?: SortType;
		sortOrder?: "asc" | "desc";
		dateType?: SortType;
		dateFrom?: string;
		dateTo?: string;
		status?: TaskStatus[];
		page?: number;
		limit?: number;
	}) {
		const page = Number(params.page ?? 1);
		const limit = Number(params.limit ?? 20);
		const sortType = params.sortType ?? "deadline";
		const sortOrder = params.sortOrder ?? "asc";

		const baseWhere: Prisma.TaskWhereInput = {
			userId: params.userId,
			kind: "task",
			status: { in: params.status ?? [] },
			project: {
				status: "active",
				...(params.projectId ? { uuid: params.projectId } : {}),
			},
			...(params.search
				? {
						title: {
							contains: params.search,
						},
					}
				: {}),
		};

		if (params.dateType) {
			const range: Prisma.DateTimeFilter = {};
			if (params.dateFrom) {
				range.gte = new Date(params.dateFrom);
			}
			if (params.dateTo) {
				range.lte = new Date(params.dateTo);
			}
			Object.assign(baseWhere, {
				[params.dateType]: range,
			});
		}

		const where: Prisma.TaskWhereInput = {
			OR: [
				{
					...baseWhere,
					parent: {
						is: {
							status: "scheduled",
						},
					},
				},
				{
					...baseWhere,
					parent: {
						is: null,
					},
				},
			],
		};

		const orderBy = {
			...sortFieldMap[sortType],
			[sortType]: sortOrder,
		} as Prisma.TaskOrderByWithRelationInput;

		const [data, totalCount] = await Promise.all([
			tasksModel.findMany({
				where,
				include: taskInclude,
				orderBy,
				take: limit,
				skip: (page - 1) * limit,
			}),
			tasksModel.count({ where }),
		]);

		return {
			data,
			pageInfo: buildPageInfo({
				page,
				limit,
				sortOrder,
				sortType,
				totalCount,
			}),
		};
	},

	async create(params: {
		userId: number;
		title: string;
		projectId: string;
		deadline: string;
		startingAt?: string | null;
		status: TaskStatus;
		kind: TaskKind;
	}) {
		const project = await projectsModel.findByUuid(params.projectId);
		if (!project) {
			throw new HttpError(404, "Project not found");
		}

		return tasksModel.create({
			data: {
				uuid: crypto.randomUUID(),
				title: params.title,
				userId: params.userId,
				projectId: project.id,
				deadline: new Date(params.deadline),
				startingAt: toNullableDate(params.startingAt),
				status: params.status,
				kind: params.kind,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			include: taskInclude,
		});
	},

	async findOne(userId: number, uuid: string) {
		const task = await tasksModel.findFirst({
			where: {
				uuid,
				userId,
			},
			include: taskInclude,
		});

		if (!task) {
			throw new HttpError(404, "Not Found");
		}

		return task;
	},

	async update(
		userId: number,
		uuid: string,
		values: Partial<{
			title: string;
			projectId: string;
			status: TaskStatus;
			deadline: string;
			finishedAt: string | null;
			startingAt: string | null;
			startedAt: string | null;
			archivedAt: string | null;
		}>,
	) {
		const task = await this.findOne(userId, uuid);
		let nextProjectId = task.projectId;
		if (values.projectId) {
			const project = await projectsModel.findByUuid(values.projectId);
			if (!project) {
				throw new HttpError(404, "Project not found");
			}
			nextProjectId = project.id;
		}

		const data: Prisma.TaskUpdateInput = {
			updatedAt: new Date(),
			...(values.title !== undefined ? { title: values.title } : {}),
			...(values.status !== undefined ? { status: values.status } : {}),
			...(values.deadline !== undefined
				? { deadline: new Date(values.deadline) }
				: {}),
			...(values.finishedAt !== undefined
				? { finishedAt: toNullableDate(values.finishedAt) }
				: {}),
			...(values.startingAt !== undefined
				? { startingAt: toNullableDate(values.startingAt) }
				: {}),
			...(values.startedAt !== undefined
				? { startedAt: toNullableDate(values.startedAt) }
				: {}),
			...(values.archivedAt !== undefined
				? { archivedAt: toNullableDate(values.archivedAt) }
				: {}),
			project: {
				connect: { id: nextProjectId },
			},
		};

		const updated = await tasksModel.update({
			where: { id: task.id },
			data,
			include: taskInclude,
		});

		if (task.children.length > 0 && nextProjectId !== task.projectId) {
			await tasksModel.updateMany({
				where: {
					id: {
						in: task.children.map((child) => child.id),
					},
					userId,
				},
				data: {
					projectId: nextProjectId,
					updatedAt: new Date(),
				},
			});
		}

		return updated;
	},

	async updateStatuses(
		userId: number,
		uuids: string[],
		next: {
			status: TaskStatus;
			finishedAt?: Date | null;
			archivedAt?: Date | null;
		},
	) {
		await tasksModel.updateMany({
			where: {
				uuid: { in: uuids },
				userId,
			},
			data: {
				status: next.status,
				finishedAt: next.finishedAt ?? null,
				archivedAt: next.archivedAt ?? null,
				updatedAt: new Date(),
			},
		});

		return tasksModel.findMany({
			where: {
				uuid: { in: uuids },
				userId,
			},
			include: taskInclude,
		});
	},

	archive(userId: number, uuids: string[]) {
		return this.updateStatuses(userId, uuids, {
			status: "archived",
			archivedAt: dayjs().toDate(),
			finishedAt: null,
		});
	},

	complete(userId: number, uuids: string[]) {
		return this.updateStatuses(userId, uuids, {
			status: "completed",
			finishedAt: dayjs().toDate(),
			archivedAt: null,
		});
	},

	reopen(userId: number, uuids: string[]) {
		return this.updateStatuses(userId, uuids, {
			status: "scheduled",
			finishedAt: null,
			archivedAt: null,
		});
	},

	async milestones(
		userId: number,
		projectSlug: string,
		statuses = ["scheduled"],
	) {
		const [milestones, orphans] = await Promise.all([
			tasksModel.findMany({
				where: {
					userId,
					kind: "milestone",
					status: { in: statuses },
					project: {
						slug: projectSlug,
					},
				},
				include: taskInclude,
				orderBy: {
					deadline: "asc",
				},
			}),
			tasksModel.findMany({
				where: {
					userId,
					kind: "task",
					parentId: null,
					status: { in: statuses },
					project: {
						slug: projectSlug,
					},
				},
				include: taskInclude,
				orderBy: {
					deadline: "desc",
				},
			}),
		]);

		return { milestones, orphans };
	},

	async stats(projectIds: number[]) {
		if (projectIds.length === 0) {
			return {};
		}

		const [kindStats, stateStats] = await Promise.all([
			prisma.task.groupBy({
				by: ["projectId", "kind"],
				where: { projectId: { in: projectIds } },
				_count: { _all: true },
			}),
			prisma.task.groupBy({
				by: ["projectId", "status"],
				where: { projectId: { in: projectIds } },
				_count: { _all: true },
			}),
		]);

		const base = Object.fromEntries(
			projectIds.map((id) => [
				id,
				{
					total: 0,
					kinds: { milestone: 0, task: 0 },
					states: { scheduled: 0, completed: 0, archived: 0 },
				},
			]),
		) as Record<
			number,
			{
				total: number;
				kinds: Record<string, number>;
				states: Record<string, number>;
			}
		>;

		kindStats.forEach((entry) => {
			const count =
				typeof entry._count === "object" && entry._count
					? (entry._count._all ?? 0)
					: 0;
			base[entry.projectId].kinds[entry.kind] = count;
		});

		stateStats.forEach((entry) => {
			const count =
				typeof entry._count === "object" && entry._count
					? (entry._count._all ?? 0)
					: 0;
			base[entry.projectId].states[entry.status] = count;
			base[entry.projectId].total += count;
		});

		return base;
	},
};
