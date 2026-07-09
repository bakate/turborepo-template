import { describe, expect, it } from "vitest";

import { Todo } from "./todo";

describe("Todo", () => {
	it("creates a todo with normalized title", async () => {
		const { faker } = await import("@faker-js/faker");
		const now = faker.date.recent();
		const todoId = faker.string.uuid();
		const todoTitle = faker.lorem.words({ min: 2, max: 5 });
		const result = Todo.create({
			id: todoId,
			title: `  ${todoTitle}  `,
			now,
		});

		expect(result.success).toBe(true);

		if (!result.success) {
			return;
		}

		expect(result.value.id).toBe(todoId);
		expect(result.value.toSnapshot()).toEqual({
			id: todoId,
			title: todoTitle,
			completed: false,
			createdAt: now.toISOString(),
			updatedAt: null,
		});
	});

	it("rejects an empty title", async () => {
		const { faker } = await import("@faker-js/faker");
		const result = Todo.create({
			id: faker.string.uuid(),
			title: "   ",
			now: faker.date.recent(),
		});

		expect(result).toEqual({
			success: false,
			error: {
				code: "INVALID_TODO_TITLE",
				message: "Todo title cannot be empty.",
			},
		});
	});
});
