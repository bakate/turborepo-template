import { todoListMachine } from "@workspace/application/todos/machines/todo-list";
import { useMachine } from "@xstate/react";

import { TodoHttpGateway } from "../../infrastructure/http/todo-http-gateway";

const todoGateway = new TodoHttpGateway();

export function useTodoListMachine() {
	return useMachine(todoListMachine, {
		input: {
			todoGateway,
		},
	});
}
