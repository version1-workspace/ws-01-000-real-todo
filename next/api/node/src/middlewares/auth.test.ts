import { beforeEach, describe, expect, it, vi } from "vitest";
import { type AuthenticatedRequest, requireAuth } from "./auth.js";

const { usersModel, verifyAccessToken } = vi.hoisted(() => ({
	usersModel: {
		findByUsername: vi.fn(),
	},
	verifyAccessToken: vi.fn(),
}));

vi.mock("../models/users.js", () => ({ usersModel }));
vi.mock("../lib/auth.js", () => ({ verifyAccessToken }));

const createResponse = () => ({}) as never;

const createNext = () => vi.fn();

describe("requireAuth", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("Authorization header の Bearer token で認証する", async () => {
		const req = {
			headers: { authorization: "Bearer access-token" },
		} as unknown as AuthenticatedRequest;
		const user = { id: 1, username: "user 1" };
		verifyAccessToken.mockReturnValue({ sub: "user 1" });
		usersModel.findByUsername.mockResolvedValue(user);
		const next = createNext();

		await requireAuth(req, createResponse(), next);

		expect(verifyAccessToken).toHaveBeenCalledWith("access-token");
		expect(req.currentUser).toBe(user);
		expect(next).toHaveBeenCalledWith();
	});

	it("accessToken cookie だけでは認証しない", async () => {
		const req = {
			headers: {},
			cookies: { accessToken: "cookie-token" },
		} as unknown as AuthenticatedRequest;
		const next = createNext();

		await requireAuth(req, createResponse(), next);

		expect(verifyAccessToken).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: 401,
				message: "Unauthorized: Missing or invalid Authorization header",
			}),
		);
	});
});
