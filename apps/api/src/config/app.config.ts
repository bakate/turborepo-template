import { z } from "zod";

const defaultPort = 3000;
const defaultRateLimitTtlMs = 60_000;
const defaultRateLimitLimit = 100;

const appConfigSchema = z.object({
	PORT: z.coerce.number().int().positive().default(defaultPort),
	CORS_ORIGIN: z.string().trim().min(1).optional(),
	API_RATE_LIMIT_TTL_MS: z.coerce
		.number()
		.int()
		.positive()
		.default(defaultRateLimitTtlMs),
	API_RATE_LIMIT_LIMIT: z.coerce
		.number()
		.int()
		.positive()
		.default(defaultRateLimitLimit),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export function validateAppConfig(config: Record<string, unknown>): AppConfig {
	const result = appConfigSchema.safeParse(config);

	if (result.success) {
		return result.data;
	}

	const message = result.error.issues
		.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
		.join("; ");

	throw new Error(`Invalid API environment configuration: ${message}`);
}
