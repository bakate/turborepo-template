import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";

import { parseTodo } from "./todo";

describe("Todo schema", () => {
	it("should decode a valid todo", () => {
		const todoTitle = faker.lorem.words({ min: 2, max: 5 });
		const validTodo = {
			id: faker.string.uuid(),
			title: todoTitle,
			completed: false,
			createdAt: faker.date.recent().toISOString(),
			updatedAt: null,
		};

		const result = parseTodo({ input: validTodo });

		expect(result.success).toBe(true);

		if (!result.success) {
			return;
		}

		expect(result.todo.title).toBe(todoTitle);
	});

	it("should fail on invalid data", () => {
		const invalidTodo = {
			id: "not-a-uuid",
			title: "",
		};

		const result = parseTodo({ input: invalidTodo });

		expect(result.success).toBe(false);
	});
});
