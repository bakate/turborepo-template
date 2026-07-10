import { randomUUID } from "node:crypto";

import type { Result } from "../../../../shared/result";
import { Todo, type TodoError } from "../../domain/todo";
import type { TodoRepository } from "../ports/todo-repository.port";

type CreateTodoCommand = {
	readonly title: string;
};

export class CreateTodoUseCase {
	constructor(private readonly todoRepository: TodoRepository) {}

	async execute({
		title,
	}: CreateTodoCommand): Promise<Result<Todo, TodoError>> {
		const result = Todo.create({
			id: randomUUID(),
			title,
			now: new Date(),
		});

		if (!result.success) {
			return result;
		}

		await this.todoRepository.save({
			todo: result.value,
		});

		return result;
	}
}
