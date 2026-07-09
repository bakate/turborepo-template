import { Module } from "@nestjs/common";

import { TODO_REPOSITORY } from "./application/ports/todo-repository.port";
import { CreateTodoUseCase } from "./application/use-cases/create-todo.use-case";
import { ListTodosUseCase } from "./application/use-cases/list-todos.use-case";
import { InMemoryTodoRepository } from "./infrastructure/persistence/in-memory-todo.repository";
import { TodosController } from "./presentation/http/todos.controller";

@Module({
	controllers: [TodosController],
	providers: [
		CreateTodoUseCase,
		ListTodosUseCase,
		{
			provide: TODO_REPOSITORY,
			useClass: InMemoryTodoRepository,
		},
	],
})
export class TodosModule {}
