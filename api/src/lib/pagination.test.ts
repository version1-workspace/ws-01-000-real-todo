import { describe, expect, it } from "vitest";
import { buildPageInfo } from "./pagination.js";

describe("buildPageInfo", () => {
	it("次ページなしの pageInfo を作る", () => {
		expect(
			buildPageInfo({
				page: 1,
				limit: 20,
				sortOrder: "asc",
				sortType: "deadline",
				totalCount: 20,
			}),
		).toEqual({
			page: 1,
			limit: 20,
			sortOrder: "asc",
			sortType: "deadline",
			hasNext: false,
			hasPrevious: false,
			totalCount: 20,
		});
	});

	it("前後ページありの pageInfo を作る", () => {
		expect(
			buildPageInfo({
				page: 2,
				limit: 20,
				sortOrder: "desc",
				sortType: "createdAt",
				totalCount: 45,
			}),
		).toEqual({
			page: 2,
			limit: 20,
			sortOrder: "desc",
			sortType: "createdAt",
			hasNext: true,
			hasPrevious: true,
			totalCount: 45,
		});
	});
});
