import { beforeEach, describe, expect, it, vi } from "vitest";
import type { HttpError } from "../lib/http-error.js";

const usersModel = {
	findByEmail: vi.fn(),
	findByRefreshToken: vi.fn(),
	updateRefreshToken: vi.fn(),
	clearRefreshToken: vi.fn(),
};

const comparePassword = vi.fn();
const generateRefreshToken = vi.fn();
const signAccessToken = vi.fn();

vi.mock("../models/users.js", () => ({ usersModel }));
vi.mock("../lib/password.js", () => ({
	comparePassword,
	generateRefreshToken,
}));
vi.mock("../lib/auth.js", () => ({ signAccessToken }));

const { authService } = await import("./auth.js");

describe("authService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useRealTimers();
	});

	it("存在しないメールアドレスなら 401", async () => {
		usersModel.findByEmail.mockResolvedValue(null);

		await expect(
			authService.login("none@example.com", "pw"),
		).rejects.toMatchObject({
			statusCode: 401,
			message: "Unauthorized",
		} satisfies Partial<HttpError>);
	});

	it("パスワード不一致なら 401", async () => {
		usersModel.findByEmail.mockResolvedValue({ id: 1, password: "hashed" });
		comparePassword.mockResolvedValue(false);

		await expect(
			authService.login("user@example.com", "pw"),
		).rejects.toMatchObject({
			statusCode: 401,
			message: "Unauthorized",
		});
	});

	it("refresh は token が見つからないと 401", async () => {
		usersModel.findByRefreshToken.mockResolvedValue(null);

		await expect(authService.refresh("wrong-token")).rejects.toMatchObject({
			statusCode: 401,
			message: "invalid refresh token",
		});
	});

	it("refresh は期限切れなら保存 token を失効して 401", async () => {
		usersModel.findByRefreshToken.mockResolvedValue({
			id: 1,
			refreshToken: "stored-token",
			refreshTokenExpiresAt: new Date("2025-01-01T00:00:00.000Z"),
		});
		usersModel.clearRefreshToken.mockResolvedValue({});

		await expect(authService.refresh("stored-token")).rejects.toMatchObject({
			statusCode: 401,
			message: "invalid refresh token",
		});
		expect(usersModel.clearRefreshToken).toHaveBeenCalledWith(1);
	});

	it("refresh は保存済み rememberMe を維持して token を再発行する", async () => {
		usersModel.findByRefreshToken.mockResolvedValue({
			id: 1,
			uuid: "user-uuid",
			username: "user 1",
			refreshToken: "stored-token",
			refreshTokenExpiresAt: new Date("2099-01-01T00:00:00.000Z"),
			refreshTokenRememberMe: true,
		});
		generateRefreshToken.mockResolvedValue("new-refresh-token");
		usersModel.updateRefreshToken.mockResolvedValue({
			id: 1,
			refreshToken: "new-refresh-token",
		});
		signAccessToken.mockReturnValue("signed-access-token");

		await expect(authService.refresh("stored-token")).resolves.toMatchObject({
			accessToken: "signed-access-token",
			refreshToken: "new-refresh-token",
			rememberMe: true,
		});
	});

	it("issueTokens は refresh token を更新して access token を返す", async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-05-12T00:00:00.000Z"));
		generateRefreshToken.mockResolvedValue("new-refresh-token");
		usersModel.updateRefreshToken.mockResolvedValue({
			id: 1,
			refreshToken: "new-refresh-token",
		});
		signAccessToken.mockReturnValue("signed-access-token");

		await expect(
			authService.issueTokens(
				{ id: 1, uuid: "user-uuid", username: "user 1" },
				true,
			),
		).resolves.toEqual({
			uuid: "user-uuid",
			accessToken: "signed-access-token",
			refreshToken: "new-refresh-token",
			rememberMe: true,
		});
		expect(usersModel.updateRefreshToken).toHaveBeenCalledWith(
			1,
			"new-refresh-token",
			new Date("2026-05-26T00:00:00.000Z"),
			true,
		);
		expect(signAccessToken).toHaveBeenCalledWith({ sub: "user 1" });
	});
});
