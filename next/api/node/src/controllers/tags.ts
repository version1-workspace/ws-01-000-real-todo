import type { Response } from "express";
import { z } from "zod";
import { serializeTag } from "../lib/serializers.js";
import type { AuthenticatedRequest } from "../middlewares/auth.js";
import { tagsService } from "../services/tags.js";

const statusSchema = z.enum(["enabled", "disabled"]);
const querySchema = z.object({
	limit: z.coerce.number().int().positive().optional(),
	page: z.coerce.number().int().positive().optional(),
	sortType: z.enum(["updatedAt", "createdAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
	status: z.union([statusSchema, z.array(statusSchema)]).optional(),
	"status[]": z.union([statusSchema, z.array(statusSchema)]).optional(),
});

const readStatuses = (
	query: z.infer<typeof querySchema>,
): Array<"enabled" | "disabled"> | undefined => {
	const value = query["status[]"] ?? query.status;
	if (!value) {
		return undefined;
	}
	return Array.isArray(value) ? value : [value];
};

export const tagsController = {
	async list(req: AuthenticatedRequest, res: Response) {
		const query = querySchema.parse(req.query);
		const result = await tagsService.list({
			userId: req.currentUser!.id,
			limit: query.limit,
			page: query.page,
			sortType: query.sortType,
			sortOrder: query.sortOrder,
			status: readStatuses(query),
		});

		res.json({
			data: result.data.map((tag) => serializeTag(tag)),
			pageInfo: result.pageInfo,
		});
	},
};
