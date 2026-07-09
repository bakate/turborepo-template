import { describe, expect, it } from "vitest";

import { validateAppConfig } from "./app.config";

describe("validateAppConfig", () => {
	it("returns defaults when optional variables are missing", () => {
		const config = validateAppConfig({});

		expect(config).toEqual({
			PORT: 3000,
			CORS_ORIGIN: undefined,
			API_RATE_LIMIT_TTL_MS: 60_000,
			API_RATE_LIMIT_LIMIT: 100,
		});
	});

	it("coerces numeric environment variables", () => {
		const config = validateAppConfig({
			PORT: "3100",
			API_RATE_LIMIT_TTL_MS: "120000",
			API_RATE_LIMIT_LIMIT: "50",
		});

		expect(config.PORT).toBe(3100);
		expect(config.API_RATE_LIMIT_TTL_MS).toBe(120_000);
		expect(config.API_RATE_LIMIT_LIMIT).toBe(50);
	});

	it("fails fast when numeric variables are invalid", () => {
		expect(() =>
			validateAppConfig({
				PORT: "not-a-port",
			}),
		).toThrow("Invalid API environment configuration");
	});
});
