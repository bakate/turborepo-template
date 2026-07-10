import type { INestApplication } from "@nestjs/common";
import {
	DocumentBuilder,
	type OpenAPIObject,
	SwaggerModule,
} from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";

const documentationPath = "/api/docs";
const openApiJsonPath = "/api/docs/openapi.json";
const scalarContentSecurityPolicy = [
	"default-src 'self'",
	"base-uri 'self'",
	"object-src 'none'",
	"frame-ancestors 'self'",
	"img-src 'self' data: https:",
	"font-src 'self' https: data:",
	"style-src 'self' 'unsafe-inline' https:",
	"script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
	"script-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
	"connect-src 'self'",
	"upgrade-insecure-requests",
].join("; ");

export function setupApiDocumentation({
	app,
}: {
	readonly app: INestApplication;
}): void {
	const document = createApiDocument({ app });
	const httpAdapter = app.getHttpAdapter();

	httpAdapter.get(openApiJsonPath, (_request, response) => {
		response.json(document);
	});

	app.use(
		documentationPath,
		(_request: unknown, response: DocumentationResponse, next: () => void) => {
			response.setHeader(
				"Content-Security-Policy",
				scalarContentSecurityPolicy,
			);
			next();
		},
		apiReference({
			pageTitle: "Turborepo Template API",
			url: openApiJsonPath,
		}),
	);
}

export function createApiDocument({
	app,
}: {
	readonly app: INestApplication;
}): OpenAPIObject {
	const config = new DocumentBuilder()
		.setTitle("Turborepo Template API")
		.setDescription("Nest.js API built with DDD and hexagonal architecture.")
		.setVersion("0.1.0")
		.addTag("Health")
		.addTag("Todos")
		.build();

	return SwaggerModule.createDocument(app, config);
}

type DocumentationResponse = {
	setHeader(name: string, value: string): void;
};
