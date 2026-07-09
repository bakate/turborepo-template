import { describe, expect, it } from "vitest";

import { Todo } from "./todo";

const now = new Date("2026-07-09T15:02:14.025Z");

describe("Todo", () => {
	it("creates a todo with normalized title", () => {
		const result = Todo.create({
			id: "todo-id",
			title: "  Ship the API template  ",
			now,
		});

		expect(result.success).toBe(true);

		if (!result.success) {
			return;
		}

		expect(result.value.id).toBe("todo-id");
		expect(result.value.toSnapshot()).toEqual({
			id: "todo-id",
			title: "Ship the API template",
			completed: false,
			createdAt: "2026-07-09T15:02:14.025Z",
			updatedAt: null,
		});
	});

	it("rejects an empty title", () => {
		const result = Todo.create({
			id: "todo-id",
			title: "   ",
			now,
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
