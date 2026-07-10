import { Module } from "@nestjs/common";

import type { TodoRepository } from "./application/ports/todo-repository.port";
import { CreateTodoUseCase } from "./application/use-cases/create-todo.use-case";
import { ListTodosUseCase } from "./application/use-cases/list-todos.use-case";
import { InMemoryTodoRepository } from "./infrastructure/persistence/in-memory-todo.repository";
import { TodosController } from "./presentation/http/todos.controller";

const TODO_REPOSITORY = Symbol("TODO_REPOSITORY");

@Module({
	controllers: [TodosController],
	providers: [
		{
			provide: TODO_REPOSITORY,
			useClass: InMemoryTodoRepository,
		},
		{
			provide: CreateTodoUseCase,
			inject: [TODO_REPOSITORY],
			useFactory: (todoRepository: TodoRepository) =>
				new CreateTodoUseCase(todoRepository),
		},
		{
			provide: ListTodosUseCase,
			inject: [TODO_REPOSITORY],
			useFactory: (todoRepository: TodoRepository) =>
				new ListTodosUseCase(todoRepository),
		},
	],
})
export class TodosModule {}
