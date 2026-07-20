import type { Response } from "express";
import { z } from "zod";
import { serializeProject, serializeTask } from "../lib/serializers.js";
import type { AuthenticatedRequest } from "../middlewares/auth.js";
import { projectsService } from "../services/projects.js";
import { tasksService } from "../services/tasks.js";

const statuses = z.enum(["initial", "active", "archived"]);

const listQuerySchema = z.object({
	limit: z.coerce.number().int().positive().optional(),
	page: z.coerce.number().int().positive().optional(),
	status: z.union([statuses, z.array(statuses)]).optional(),
});

const createSchema = z.object({
	name: z.string().min(1),
	deadline: z.string().min(1),
	status: statuses,
	slug: z.string().min(1),
	goal: z.string().min(1),
	shouldbe: z.string().optional().nullable(),
	milestones: z
		.array(
			z.object({
				title: z.string().min(1),
				deadline: z.string().min(1),
			}),
		)
		.optional(),
});

const updateSchema = z.object({
	name: z.string().min(1),
	deadline: z.string().min(1),
	slug: z.string().min(1),
	goal: z.string().min(1),
	shouldbe: z.string().optional().nullable(),
});

const slugSchema = z.object({
	slug: z.string().min(1),
});

const readStatuses = (
	value: z.infer<typeof listQuerySchema>["status"],
): Array<"initial" | "active" | "archived"> | undefined =>
	value ? (Array.isArray(value) ? value : [value]) : undefined;

export const projectsController = {
	async list(req: AuthenticatedRequest, res: Response) {
		const query = listQuerySchema.parse(req.query);
		const result = await projectsService.list({
			userId: req.currentUser!.id,
			limit: query.limit,
			page: query.page,
			statuses: readStatuses(query.status),
		});

		res.json({
			data: result.data.map((entry) =>
				serializeProject(entry.project, {
					milestones: entry.milestones.map((milestone) =>
						serializeTask(milestone),
					),
					stats: entry.stats,
				}),
			),
			pageInfo: result.pageInfo,
		});
	},

	async create(req: AuthenticatedRequest, res: Response) {
		const body = createSchema.parse(req.body);
		await projectsService.create({
			userId: req.currentUser!.id,
			...body,
		});
		res.status(201).send();
	},

	async show(req: AuthenticatedRequest, res: Response) {
		const { slug } = slugSchema.parse(req.params);
		const result = await projectsService.findOne(req.currentUser!.id, slug);
		res.json({
			data: serializeProject(result.project, {
				milestones: result.milestones.map((milestone) =>
					serializeTask(milestone),
				),
				stats: result.stats,
			}),
		});
	},

	async update(req: AuthenticatedRequest, res: Response) {
		const { slug } = slugSchema.parse(req.params);
		const body = updateSchema.parse(req.body);
		await projectsService.update(req.currentUser!.id, slug, body);
		res.status(200).send();
	},

	async archive(req: AuthenticatedRequest, res: Response) {
		const { slug } = slugSchema.parse(req.params);
		const project = await projectsService.updateStatus(
			req.currentUser!.id,
			slug,
			"archived",
		);
		const stats = await tasksService.stats([project.id]);
		res.json({
			data: serializeProject(project, {
				stats: stats[project.id],
			}),
		});
	},

	async reopen(req: AuthenticatedRequest, res: Response) {
		const { slug } = slugSchema.parse(req.params);
		const project = await projectsService.updateStatus(
			req.currentUser!.id,
			slug,
			"active",
		);
		const stats = await tasksService.stats([project.id]);
		res.json({
			data: serializeProject(project, {
				stats: stats[project.id],
			}),
		});
	},
};
