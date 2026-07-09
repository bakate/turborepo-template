import { describe, expect, it } from "vitest";

import type { Todo } from "../../domain/todo";
import type { TodoRepository } from "../ports/todo-repository.port";
import { CreateTodoUseCase } from "./create-todo.use-case";
import { ListTodosUseCase } from "./list-todos.use-case";

describe("ListTodosUseCase", () => {
	it("returns persisted todo snapshots", async () => {
		const { faker } = await import("@faker-js/faker");
		const todoRepository = createTodoRepository();
		const createTodoUseCase = new CreateTodoUseCase(todoRepository);
		const listTodosUseCase = new ListTodosUseCase(todoRepository);
		const todoTitle = faker.lorem.words({ min: 2, max: 5 });

		await createTodoUseCase.execute({
			title: todoTitle,
		});

		const todos = await listTodosUseCase.execute();

		expect(todos).toHaveLength(1);
		expect(todos[0]?.title).toBe(todoTitle);
	});
});

function createTodoRepository(): TodoRepository {
	const savedTodos: Todo[] = [];

	return {
		async save({ todo }) {
			savedTodos.push(todo);
		},
		async findAll() {
			return savedTodos;
		},
	};
}
