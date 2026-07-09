import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { validateAppConfig } from "../config/app.config";
import { HttpExceptionFilter } from "../shared/presentation/http-exception.filter";
import { HealthController } from "./health/presentation/health.controller";
import { TodosModule } from "./todos/todos.module";

const FEATURES_MODULES = [TodosModule];

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: validateAppConfig,
		}),
		ThrottlerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => [
				{
					ttl: configService.getOrThrow<number>("API_RATE_LIMIT_TTL_MS"),
					limit: configService.getOrThrow<number>("API_RATE_LIMIT_LIMIT"),
				},
			],
		}),
		...FEATURES_MODULES,
	],
	controllers: [HealthController],
	providers: [
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
