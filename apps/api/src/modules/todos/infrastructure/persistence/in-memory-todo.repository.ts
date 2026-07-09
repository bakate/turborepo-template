import { Injectable } from "@nestjs/common";

import type { TodoRepository } from "../../application/ports/todo-repository.port";
import type { Todo } from "../../domain/todo";

@Injectable()
export class InMemoryTodoRepository implements TodoRepository {
	private readonly todos = new Map<string, Todo>();

	async save({ todo }: { readonly todo: Todo }): Promise<void> {
		this.todos.set(todo.id, todo);
	}

	async findAll(): Promise<readonly Todo[]> {
		return [...this.todos.values()];
	}
}
