export interface PageInfo<TSort extends string> {
	page: number;
	limit: number;
	sortOrder: "asc" | "desc";
	sortType: TSort;
	hasNext: boolean;
	hasPrevious: boolean;
	totalCount: number;
}

export const buildPageInfo = <TSort extends string>(params: {
	page: number;
	limit: number;
	sortOrder: "asc" | "desc";
	sortType: TSort;
	totalCount: number;
}): PageInfo<TSort> => {
	const { page, limit, sortOrder, sortType, totalCount } = params;
	const offset = (page - 1) * limit;

	return {
		page,
		limit,
		sortOrder,
		sortType,
		hasNext: offset + limit < totalCount,
		hasPrevious: page > 1,
		totalCount,
	};
};
