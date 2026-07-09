import { describe, expect, it } from "vitest";

import { parseTodo } from "./todos";

describe("Todo schema", () => {
	it("should decode a valid todo", () => {
		const validTodo = {
			id: 1,
			title: "Test V8 Coverage",
			completed: false,
			createdAt: new Date().toISOString(),
			updatedAt: null,
		};

		const result = parseTodo({ input: validTodo });

		expect(result.success).toBe(true);

		if (!result.success) {
			return;
		}

		expect(result.todo.title).toBe("Test V8 Coverage");
	});

	it("should fail on invalid data", () => {
		const invalidTodo = {
			id: "not-a-number",
			title: "", // empty strings not allowed by NonEmptyString
		};

		const result = parseTodo({ input: invalidTodo });

		expect(result.success).toBe(false);
	});
});
