import { describe, expect, it, vi } from "vitest";
import { tokenCookie } from "./token.js";

const cookieOptions = {
	httpOnly: true,
	secure: false,
};

function createMockReq(cookies: Record<string, string> = {}) {
	return { cookies } as Parameters<typeof tokenCookie.getAccessToken>[0];
}

function createMockRes() {
	return {
		cookie: vi.fn(),
		clearCookie: vi.fn(),
	} as unknown as Parameters<typeof tokenCookie.setAccessToken>[0];
}

describe("tokenCookie", () => {
	describe("getAccessToken", () => {
		it("cookie から accessToken を取得する", () => {
			const req = createMockReq({ accessToken: "at-123" });
			expect(tokenCookie.getAccessToken(req)).toBe("at-123");
		});

		it("cookie が空なら undefined を返す", () => {
			const req = createMockReq();
			expect(tokenCookie.getAccessToken(req)).toBeUndefined();
		});

		it("cookies が undefined なら undefined を返す", () => {
			const req = { cookies: undefined } as Parameters<
				typeof tokenCookie.getAccessToken
			>[0];
			expect(tokenCookie.getAccessToken(req)).toBeUndefined();
		});
	});

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

	describe("setAccessToken", () => {
		it("accessToken を cookie にセットする", () => {
			const res = createMockRes();
			tokenCookie.setAccessToken(res, "at-789");
			expect(res.cookie).toHaveBeenCalledWith(
				"accessToken",
				"at-789",
				cookieOptions,
			);
		});
	});

	describe("setRefreshToken", () => {
		it("refreshToken を cookie にセットする", () => {
			const res = createMockRes();
			tokenCookie.setRefreshToken(res, "rt-012");
			expect(res.cookie).toHaveBeenCalledWith(
				"refreshToken",
				"rt-012",
				cookieOptions,
			);
		});
	});

	describe("clearAll", () => {
		it("accessToken と refreshToken の cookie をクリアする", () => {
			const res = createMockRes();
			tokenCookie.clearAll(res);
			expect(res.clearCookie).toHaveBeenCalledWith(
				"accessToken",
				cookieOptions,
			);
			expect(res.clearCookie).toHaveBeenCalledWith(
				"refreshToken",
				cookieOptions,
			);
		});
	});
});
