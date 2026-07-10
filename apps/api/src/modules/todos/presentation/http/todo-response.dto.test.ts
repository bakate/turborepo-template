import { describe, expect, it } from "vitest";

import { Todo } from "../../domain/todo";
import { toTodoResponseDto } from "./todo-response.dto";

describe("toTodoResponseDto", () => {
	it("serializes a domain todo for the HTTP response", async () => {
		const { faker } = await import("@faker-js/faker");
		const now = faker.date.recent();
		const todoId = faker.string.uuid();
		const todoTitle = faker.lorem.words({ min: 2, max: 5 });
		const result = Todo.create({ id: todoId, title: todoTitle, now });

		expect(result.success).toBe(true);

		if (!result.success) {
			return;
		}

		expect(toTodoResponseDto({ todo: result.value })).toEqual({
			id: todoId,
			title: todoTitle,
			completed: false,
			createdAt: now.toISOString(),
			updatedAt: null,
		});
	});
});
