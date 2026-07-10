import { useMachine } from "@xstate/react";

import { TodoHttpGateway } from "../../infrastructure/http/todo-http-gateway";
import { createTodoMachine } from "./application/machines/create-todo.machine";

const todoGateway = new TodoHttpGateway();

export function useCreateTodoMachine() {
	return useMachine(createTodoMachine, {
		input: {
			todoGateway,
		},
	});
}
