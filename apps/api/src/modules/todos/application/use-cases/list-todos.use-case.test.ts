import { describe, expect, it } from "vitest";

import type { Todo } from "../../domain/todo";
import type { TodoRepository } from "../ports/todo-repository.port";
import { CreateTodoUseCase } from "./create-todo.use-case";
import { ListTodosUseCase } from "./list-todos.use-case";

describe("ListTodosUseCase", () => {
	it("returns persisted todo snapshots", async () => {
		const todoRepository = createTodoRepository();
		const createTodoUseCase = new CreateTodoUseCase(todoRepository);
		const listTodosUseCase = new ListTodosUseCase(todoRepository);

		await createTodoUseCase.execute({
			title: "Ship the API template",
		});

		const todos = await listTodosUseCase.execute();

		expect(todos).toHaveLength(1);
		expect(todos[0]?.title).toBe("Ship the API template");
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
