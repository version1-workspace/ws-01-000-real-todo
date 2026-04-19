import type { Response } from "express";
import { z } from "zod";
import { serializeTask } from "../lib/serializers.js";
import type { AuthenticatedRequest } from "../middlewares/auth.js";
import { tasksService } from "../services/tasks.js";

const schema = z.object({
	ids: z.array(z.string().uuid()).min(1),
});

export const bulkTasksController = {
	async archive(req: AuthenticatedRequest, res: Response) {
		const body = schema.parse(req.body);
		const data = await tasksService.archive(req.currentUser!.id, body.ids);
		res.json({ data: data.map((task) => serializeTask(task)) });
	},

	async complete(req: AuthenticatedRequest, res: Response) {
		const body = schema.parse(req.body);
		const data = await tasksService.complete(req.currentUser!.id, body.ids);
		res.json({ data: data.map((task) => serializeTask(task)) });
	},

	async reopen(req: AuthenticatedRequest, res: Response) {
		const body = schema.parse(req.body);
		const data = await tasksService.reopen(req.currentUser!.id, body.ids);
		res.json({ data: data.map((task) => serializeTask(task)) });
	},
};
