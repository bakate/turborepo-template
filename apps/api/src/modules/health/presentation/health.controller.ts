import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

type HealthResponse = {
	readonly status: "ok";
};

@ApiTags("Health")
@Controller("health")
export class HealthController {
	@Get()
	@ApiOperation({ summary: "Check API health" })
	@ApiOkResponse({
		description: "The API is running.",
		schema: {
			type: "object",
			required: ["status"],
			properties: {
				status: {
					type: "string",
					enum: ["ok"],
					example: "ok",
				},
			},
		},
	})
	check(): HealthResponse {
		return {
			status: "ok",
		};
	}
}
