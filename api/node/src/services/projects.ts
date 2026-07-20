import crypto from "crypto";
import { buildPageInfo } from "../lib/pagination.js";
import { HttpError } from "../lib/http-error.js";
import type { Prisma } from "../models/prisma.js";
import { projectsModel } from "../models/projects.js";
import { tasksService } from "./tasks.js";
import { prisma } from "../models/prisma.js";

type ProjectStatus = "initial" | "active" | "archived";

export const projectsService = {
	async list(params: {
		userId: number;
		statuses?: ProjectStatus[];
		limit?: number;
		page?: number;
	}) {
		const limit = Number(params.limit ?? 5);
		const page = Number(params.page ?? 1);
		const where = {
			userId: params.userId,
			status: {
				in: params.statuses ?? ["active"],
			},
		} satisfies Prisma.ProjectWhereInput;

		const [data, totalCount] = await Promise.all([
			projectsModel.findMany({
				where,
				orderBy: { deadline: "asc" },
				take: limit,
				skip: (page - 1) * limit,
			}),
			projectsModel.count({ where }),
		]);

		const stats = await tasksService.stats(data.map((project) => project.id));
		const milestonesMap = await Promise.all(
			data.map(async (project) => {
				const collection = await tasksService.milestones(
					params.userId,
					project.slug,
				);
				return [project.id, collection.milestones] as const;
			}),
		);

		return {
			data: data.map((project) => ({
				project,
				milestones: milestonesMap.find(([id]) => id === project.id)?.[1] ?? [],
				stats: stats[project.id],
			})),
			pageInfo: buildPageInfo({
				page,
				limit,
				sortType: "deadline",
				sortOrder: "asc",
				totalCount,
			}),
		};
	},

	async create(params: {
		userId: number;
		name: string;
		deadline: string;
		status: ProjectStatus;
		slug: string;
		goal: string;
		shouldbe?: string | null;
		milestones?: Array<{ title: string; deadline: string }>;
	}) {
		const now = new Date();
		return prisma.$transaction(async (tx) => {
			const project = await tx.project.create({
				data: {
					name: params.name,
					deadline: new Date(params.deadline),
					status: params.status,
					slug: params.slug,
					goal: params.goal,
					shouldbe: params.shouldbe ?? null,
					userId: params.userId,
					createdAt: now,
					updatedAt: now,
					uuid: crypto.randomUUID(),
				},
			});

			if (params.milestones?.length) {
				await tx.task.createMany({
					data: params.milestones.map((milestone) => ({
						title: milestone.title,
						deadline: new Date(milestone.deadline),
						status: "scheduled",
						kind: "milestone",
						userId: params.userId,
						projectId: project.id,
						createdAt: now,
						updatedAt: now,
						uuid: crypto.randomUUID(),
					})),
				});
			}

			return project;
		});
	},

	async findOne(userId: number, slug: string) {
		const project = await projectsModel.findBySlug(userId, slug);
		if (!project) {
			throw new HttpError(404, "Not Found");
		}

		const [stats, milestones] = await Promise.all([
			tasksService.stats([project.id]),
			tasksService.milestones(userId, slug),
		]);

		return {
			project,
			milestones: milestones.milestones,
			stats: stats[project.id],
		};
	},

	async update(
		userId: number,
		slug: string,
		values: {
			name: string;
			deadline: string;
			slug: string;
			goal: string;
			shouldbe?: string | null;
		},
	) {
		const current = await projectsModel.findBySlug(userId, slug);
		if (!current) {
			throw new HttpError(404, "Not Found");
		}

		return projectsModel.update({
			where: { id: current.id },
			data: {
				...values,
				deadline: new Date(values.deadline),
				shouldbe: values.shouldbe ?? null,
				updatedAt: new Date(),
			},
		});
	},

	async updateStatus(userId: number, slug: string, status: ProjectStatus) {
		const current = await projectsModel.findBySlug(userId, slug);
		if (!current) {
			throw new HttpError(404, "Not Found");
		}

		return projectsModel.update({
			where: { id: current.id },
			data: {
				status,
				archivedAt: status === "archived" ? new Date() : null,
				updatedAt: new Date(),
			},
		});
	},
};
