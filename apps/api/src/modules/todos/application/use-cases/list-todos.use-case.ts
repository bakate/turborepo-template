import { Inject, Injectable } from "@nestjs/common";
import type { Todo } from "../../domain/todo";
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

	async execute(): Promise<readonly Todo[]> {
		return this.todoRepository.findAll();
	}
}
