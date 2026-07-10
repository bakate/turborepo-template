import { useMachine } from "@xstate/react";

import { createTodoMachine } from "./application/machines/create-todo.machine";
import { TodoHttpGateway } from "./infrastructure/http/todo-http-gateway";

const todoGateway = new TodoHttpGateway();

export function useCreateTodoMachine() {
	return useMachine(createTodoMachine, {
		input: {
			todoGateway,
		},
	});
}
