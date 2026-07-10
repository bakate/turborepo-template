import type { Todo } from "../../domain/todo";
import type { TodoRepository } from "../ports/todo-repository.port";

export class ListTodosUseCase {
	constructor(private readonly todoRepository: TodoRepository) {}

	async execute(): Promise<readonly Todo[]> {
		return this.todoRepository.findAll();
	}
}
