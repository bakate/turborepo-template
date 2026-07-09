import { createTodoMachine } from "@workspace/application/todos/machines/create-todo";
import { useMachine } from "@xstate/react";

import { TodoHttpGateway } from "../../infrastructure/http/todo-http-gateway";

const todoGateway = new TodoHttpGateway();

export function useCreateTodoMachine() {
	return useMachine(createTodoMachine, {
		input: {
			todoGateway,
		},
	});
}
