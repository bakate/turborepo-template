import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
	input: "../../apps/api/openapi/openapi.json",
	output: "../../apps/web/src/generated/api",
	plugins: ["@hey-api/typescript"],
});
