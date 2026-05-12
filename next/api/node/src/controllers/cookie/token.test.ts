import { describe, expect, it, vi } from "vitest";
import { tokenCookie } from "./token.js";

const cookieOptions = {
	httpOnly: true,
	secure: false,
};

function createMockReq(cookies: Record<string, string> = {}) {
	return { cookies } as Parameters<typeof tokenCookie.getRefreshToken>[0];
}

function createMockRes() {
	return {
		cookie: vi.fn(),
		clearCookie: vi.fn(),
	} as unknown as Parameters<typeof tokenCookie.setRefreshToken>[0];
}

describe("tokenCookie", () => {
	describe("getRefreshToken", () => {
		it("cookie から refreshToken を取得する", () => {
			const req = createMockReq({ refreshToken: "rt-456" });
			expect(tokenCookie.getRefreshToken(req)).toBe("rt-456");
		});

		it("cookie が空なら undefined を返す", () => {
			const req = createMockReq();
			expect(tokenCookie.getRefreshToken(req)).toBeUndefined();
		});
	});

	describe("setRefreshToken", () => {
		it("rememberMe なしなら session cookie にする", () => {
			const res = createMockRes();
			tokenCookie.setRefreshToken(res, "rt-012", false);
			expect(res.cookie).toHaveBeenCalledWith(
				"refreshToken",
				"rt-012",
				cookieOptions,
			);
		});

		it("rememberMe ありなら 2 週間の cookie にする", () => {
			const res = createMockRes();
			tokenCookie.setRefreshToken(res, "rt-012", true);
			expect(res.cookie).toHaveBeenCalledWith("refreshToken", "rt-012", {
				...cookieOptions,
				maxAge: 14 * 24 * 60 * 60 * 1000,
			});
		});
	});

	describe("clearAll", () => {
		it("refreshToken cookie をクリアする", () => {
			const res = createMockRes();
			tokenCookie.clearAll(res);
			expect(res.clearCookie).toHaveBeenCalledWith(
				"refreshToken",
				cookieOptions,
			);
		});
	});
});
