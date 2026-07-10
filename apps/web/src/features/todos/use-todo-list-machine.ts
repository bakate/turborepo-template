import { useMachine } from "@xstate/react";

import { TodoHttpGateway } from "../../infrastructure/http/todo-http-gateway";
import { todoListMachine } from "./application/machines/todo-list.machine";

const todoGateway = new TodoHttpGateway();

export function useTodoListMachine() {
	return useMachine(todoListMachine, {
		input: {
			todoGateway,
		},
	});
}
