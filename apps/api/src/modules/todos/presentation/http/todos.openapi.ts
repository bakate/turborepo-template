import type { ApiBody, ApiOkResponse } from "@nestjs/swagger";

type RequestBodySchema = Extract<
	Parameters<typeof ApiBody>[0],
	{ readonly schema: unknown }
>["schema"];
type ResponseSchema = Extract<
	NonNullable<Parameters<typeof ApiOkResponse>[0]>,
	{ readonly schema: unknown }
>["schema"];

const todoSnapshotSchema: ResponseSchema = {
	type: "object",
	required: ["id", "title", "completed", "createdAt", "updatedAt"],
	properties: {
		id: {
			type: "string",
			format: "uuid",
			example: "6f0dfd9f-6b6e-4918-9312-8c0f7f54631d",
		},
		title: {
			type: "string",
			example: "Ship the API template",
		},
		completed: {
			type: "boolean",
			example: false,
		},
		createdAt: {
			type: "string",
			format: "date-time",
			example: "2026-07-09T15:02:14.025Z",
		},
		updatedAt: {
			type: "string",
			format: "date-time",
			nullable: true,
			example: null,
		},
	},
};

export const createTodoBodyOpenApiSchema: RequestBodySchema = {
	type: "object",
	required: ["title"],
	properties: {
		title: {
			type: "string",
			minLength: 1,
			maxLength: 120,
			example: "Ship the API template",
		},
	},
};

export const createTodoResponseOpenApiSchema: ResponseSchema = {
	type: "object",
	required: ["todo"],
	properties: {
		todo: todoSnapshotSchema,
	},
};

export const listTodosResponseOpenApiSchema: ResponseSchema = {
	type: "object",
	required: ["todos"],
	properties: {
		todos: {
			type: "array",
			items: todoSnapshotSchema,
		},
	},
};

export const apiErrorOpenApiSchema: ResponseSchema = {
	type: "object",
	required: ["error"],
	properties: {
		error: {
			type: "object",
			required: ["code", "message"],
			properties: {
				code: {
					type: "string",
					example: "VALIDATION_FAILED",
				},
				message: {
					type: "string",
					example: "Request validation failed.",
				},
				details: {
					type: "array",
					items: {
						type: "object",
						required: ["message"],
						properties: {
							path: {
								type: "array",
								items: {
									type: "string",
								},
							},
							message: {
								type: "string",
								example: "Too small: expected string to have >=1 characters",
							},
						},
					},
				},
			},
		},
	},
};
