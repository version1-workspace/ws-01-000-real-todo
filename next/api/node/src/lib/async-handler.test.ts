import { describe, expect, it, vi } from "vitest";
import { asyncHandler } from "./async-handler.js";

describe("asyncHandler", () => {
	it("成功時は handler をそのまま実行する", async () => {
		const next = vi.fn();
		const handler = vi.fn().mockResolvedValue(undefined);

		await asyncHandler(handler)({} as never, {} as never, next);

		expect(handler).toHaveBeenCalled();
		expect(next).not.toHaveBeenCalled();
	});

	it("失敗時は next に流す", async () => {
		const error = new Error("boom");
		const next = vi.fn();
		const handler = vi.fn().mockRejectedValue(error);

		await asyncHandler(handler)({} as never, {} as never, next);

		expect(next).toHaveBeenCalledWith(error);
	});
});
