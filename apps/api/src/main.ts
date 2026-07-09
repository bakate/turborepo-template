import "reflect-metadata";

import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";

import { AppModule } from "./modules/app.module";
import { setupApiDocumentation } from "./shared/presentation/api-documentation";

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	const port = configService.getOrThrow<number>("PORT");

	app.use(helmet());
	app.setGlobalPrefix("api");
	app.enableShutdownHooks();
	setupApiDocumentation({ app });

	const allowedOrigin = configService.get<string>("CORS_ORIGIN");

	if (allowedOrigin !== undefined && allowedOrigin.length > 0) {
		app.enableCors({
			origin: allowedOrigin,
		});
	}

	await app.listen(port);

	Logger.log(`API listening on http://localhost:${port}/api`, "Bootstrap");
}

void bootstrap();
