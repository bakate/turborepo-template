import { describe, expect, it } from "vitest";

import type { Todo } from "../../domain/todo";
import type { TodoRepository } from "../ports/todo-repository.port";
import { CreateTodoUseCase } from "./create-todo.use-case";

describe("CreateTodoUseCase", () => {
	it("creates and saves a todo", async () => {
		const { faker } = await import("@faker-js/faker");
		const todoRepository = createTodoRepository();
		const useCase = new CreateTodoUseCase(todoRepository);
		const todoTitle = faker.lorem.words({ min: 2, max: 5 });

		const result = await useCase.execute({
			title: todoTitle,
		});

		expect(result.success).toBe(true);
		expect(todoRepository.savedTodos).toHaveLength(1);

		if (!result.success) {
			return;
		}

		expect(result.value.title).toBe(todoTitle);
		expect(result.value.completed).toBe(false);
	});

	it("returns a business error without saving invalid todos", async () => {
		const todoRepository = createTodoRepository();
		const useCase = new CreateTodoUseCase(todoRepository);

		const result = await useCase.execute({
			title: " ",
		});

		expect(result).toEqual({
			success: false,
			error: {
				code: "INVALID_TODO_TITLE",
				message: "Todo title cannot be empty.",
			},
		});
		expect(todoRepository.savedTodos).toHaveLength(0);
	});
});

function createTodoRepository(): TodoRepository & {
	readonly savedTodos: Todo[];
} {
	const savedTodos: Todo[] = [];

	return {
		savedTodos,
		async save({ todo }) {
			savedTodos.push(todo);
		},
		async findAll() {
			return savedTodos;
		},
	};
}
