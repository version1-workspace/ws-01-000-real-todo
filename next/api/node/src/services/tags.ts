import { buildPageInfo } from "../lib/pagination.js";
import type { Prisma } from "../models/prisma.js";
import { tagsModel } from "../models/tags.js";

type TagStatus = "enabled" | "disabled";

export const tagsService = {
	async list(params: {
		userId: number;
		status?: TagStatus[];
		sortType?: "updatedAt" | "createdAt";
		sortOrder?: "asc" | "desc";
		limit?: number;
		page?: number;
	}) {
		const limit = Number(params.limit ?? 20);
		const page = Number(params.page ?? 1);
		const sortType = params.sortType ?? "createdAt";
		const sortOrder = params.sortOrder ?? "desc";
		const where = {
			userId: params.userId,
			status: {
				in: params.status ?? [],
			},
		} satisfies Prisma.TagWhereInput;

		const [data, totalCount] = await Promise.all([
			tagsModel.findMany({
				where,
				orderBy: {
					[sortType]: sortOrder,
				},
				take: limit,
				skip: (page - 1) * limit,
			}),
			tagsModel.count({ where }),
		]);

		return {
			data,
			pageInfo: buildPageInfo({
				page,
				limit,
				sortType,
				sortOrder,
				totalCount,
			}),
		};
	},
};
