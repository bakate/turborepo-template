import { Inject, Injectable } from "@nestjs/common";
import type { TodoSnapshot } from "../../domain/todo";
import {
	TODO_REPOSITORY,
	type TodoRepository,
} from "../ports/todo-repository.port";

@Injectable()
export class ListTodosUseCase {
	constructor(
		@Inject(TODO_REPOSITORY)
		private readonly todoRepository: TodoRepository,
	) {}

	async execute(): Promise<readonly TodoSnapshot[]> {
		const todos = await this.todoRepository.findAll();

		return todos.map((todo) => todo.toSnapshot());
	}
}
