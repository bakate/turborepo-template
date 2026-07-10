import "reflect-metadata";

import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "../src/modules/app.module";
import { createApiDocument } from "../src/shared/presentation/api-documentation";

const openApiDirectory = resolve(process.cwd(), "openapi");
const openApiFile = resolve(openApiDirectory, "openapi.json");

async function generateOpenApiSchema(): Promise<void> {
	const app = await NestFactory.create(AppModule, { logger: false });

	try {
		app.setGlobalPrefix("api");
		const document = createApiDocument({ app });

		await mkdir(openApiDirectory, { recursive: true });
		await writeFile(openApiFile, `${JSON.stringify(document, null, 2)}\n`);
	} finally {
		await app.close();
	}
}

void generateOpenApiSchema().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error);

	process.stderr.write(`OpenAPI generation failed: ${message}\n`);
	process.exitCode = 1;
});
