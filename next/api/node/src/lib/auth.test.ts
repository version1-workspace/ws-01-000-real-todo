import { describe, expect, it } from "vitest";
import { signAccessToken, verifyAccessToken } from "./auth.js";

describe("auth lib", () => {
	it("署名した token を verify できる", () => {
		const token = signAccessToken({
			sub: "user 1",
		});

		expect(verifyAccessToken(token)).toMatchObject({
			sub: "user 1",
		});
	});
});
