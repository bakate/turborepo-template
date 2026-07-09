import { randomUUID } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";

import { type Result, success } from "../../../../shared/result";
import { Todo, type TodoError, type TodoSnapshot } from "../../domain/todo";
import {
	TODO_REPOSITORY,
	type TodoRepository,
} from "../ports/todo-repository.port";

type CreateTodoCommand = {
	readonly title: string;
};

@Injectable()
export class CreateTodoUseCase {
	constructor(
		@Inject(TODO_REPOSITORY)
		private readonly todoRepository: TodoRepository,
	) {}

	async execute({
		title,
	}: CreateTodoCommand): Promise<Result<TodoSnapshot, TodoError>> {
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

		return success({
			value: result.value.toSnapshot(),
		});
	}
}
