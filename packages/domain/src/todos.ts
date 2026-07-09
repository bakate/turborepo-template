import { z } from "zod";

const todoIdSchema = z.number().int().positive().brand<"TodoId">();

export const todoSchema = z.object({
	id: todoIdSchema,
	title: z.string().min(1),
	completed: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date().nullable(),
});

export type TodoId = z.infer<typeof todoIdSchema>;
export type Todo = z.infer<typeof todoSchema>;

export type ParseTodoResult =
	| {
			readonly success: true;
			readonly todo: Todo;
	  }
	| {
			readonly success: false;
			readonly issues: readonly string[];
	  };

export function parseTodo({
	input,
}: {
	readonly input: unknown;
}): ParseTodoResult {
	const result = todoSchema.safeParse(input);

	if (result.success) {
		return {
			success: true,
			todo: result.data,
		};
	}

	return {
		success: false,
		issues: result.error.issues.map((issue) => issue.message),
	};
}
