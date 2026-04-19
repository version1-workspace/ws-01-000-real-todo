import { describe, expect, it } from "vitest";
import {
	serializeProject,
	serializeTag,
	serializeTask,
	serializeUser,
} from "./serializers.js";

describe("serializers", () => {
	const now = new Date("2026-01-02T03:04:05.000Z");

	it("serializeUser は公開項目だけを返す", () => {
		expect(
			serializeUser({
				uuid: "user-uuid",
				username: "user 1",
				email: "user@example.com",
				status: "active",
				createdAt: now,
				updatedAt: now,
			} as never),
		).toEqual({
			uuid: "user-uuid",
			username: "user 1",
			email: "user@example.com",
			status: "active",
			createdAt: now.toISOString(),
			updatedAt: now.toISOString(),
		});
	});

	it("serializeTag は時刻を ISO 文字列にする", () => {
		expect(
			serializeTag({
				id: 1,
				uuid: "tag-uuid",
				name: "調査",
				status: "enabled",
				userId: 2,
				createdAt: now,
				updatedAt: now,
			} as never),
		).toEqual({
			id: 1,
			uuid: "tag-uuid",
			name: "調査",
			status: "enabled",
			userId: 2,
			createdAt: now.toISOString(),
			updatedAt: now.toISOString(),
		});
	});

	it("serializeProject は default stats を補う", () => {
		const result = serializeProject({
			id: 1,
			uuid: "project-uuid",
			name: "Project",
			status: "active",
			deadline: now,
			startingAt: null,
			startedAt: null,
			archivedAt: null,
			finishedAt: null,
			slug: "project",
			goal: "Goal",
			shouldbe: null,
			userId: 1,
			createdAt: now,
			updatedAt: now,
		} as never);

		expect(result.stats).toEqual({
			total: 0,
			kinds: { milestone: 0, task: 0 },
			states: { scheduled: 0, completed: 0, archived: 0 },
		});
		expect(result.milestones).toEqual([]);
	});

	it("serializeTask は関連を含めて整形する", () => {
		const result = serializeTask(
			{
				id: 10,
				uuid: "task-uuid",
				title: "Task",
				status: "scheduled",
				kind: "task",
				deadline: now,
				startingAt: now,
				startedAt: now,
				finishedAt: now,
				archivedAt: null,
				parentId: 99,
				userId: 1,
				projectId: 2,
				createdAt: now,
				updatedAt: now,
				project: {
					id: 2,
					uuid: "project-uuid",
					name: "Project",
					status: "active",
					deadline: now,
					startingAt: null,
					startedAt: null,
					archivedAt: null,
					finishedAt: null,
					slug: "project",
					goal: "Goal",
					shouldbe: null,
					userId: 1,
					createdAt: now,
					updatedAt: now,
				},
				parent: {
					id: 99,
					uuid: "parent-uuid",
					title: "Parent",
					status: "scheduled",
					kind: "milestone",
					deadline: now,
					startingAt: null,
					startedAt: null,
					finishedAt: null,
					archivedAt: null,
					parentId: null,
					userId: 1,
					projectId: 2,
					createdAt: now,
					updatedAt: now,
				},
				children: [
					{
						id: 11,
						uuid: "child-uuid",
						title: "Child",
						status: "scheduled",
						kind: "task",
						deadline: now,
						startingAt: null,
						startedAt: null,
						finishedAt: null,
						archivedAt: null,
						parentId: 10,
						userId: 1,
						projectId: 2,
						createdAt: now,
						updatedAt: now,
					},
				],
				tagTasks: [
					{
						tag: {
							id: 3,
							uuid: "tag-uuid",
							name: "調査",
							status: "enabled",
							userId: 1,
							createdAt: now,
							updatedAt: now,
						},
					},
				],
			} as never,
			{
				includeProject: true,
				includeParent: true,
				includeChildren: true,
				includeTags: true,
			},
		);

		expect(result).toMatchObject({
			id: 10,
			uuid: "task-uuid",
			deadline: "2026-01-02",
			startingAt: "2026-01-02",
			startedAt: now.toISOString(),
			finishedAt: now.toISOString(),
			project: {
				uuid: "project-uuid",
			},
			parent: {
				uuid: "parent-uuid",
			},
			children: [
				{
					uuid: "child-uuid",
				},
			],
			tags: [
				{
					uuid: "tag-uuid",
				},
			],
		});
	});
});
