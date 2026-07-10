import { useMachine } from "@xstate/react";

import { todoListMachine } from "./application/machines/todo-list.machine";
import { TodoHttpGateway } from "./infrastructure/http/todo-http-gateway";

const todoGateway = new TodoHttpGateway();

export function useTodoListMachine() {
	return useMachine(todoListMachine, {
		input: {
			todoGateway,
		},
	});
}
