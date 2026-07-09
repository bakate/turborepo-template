import type { Todo } from "@workspace/domain/todos";

export type TodoGatewayError = {
	readonly code: "TODO_GATEWAY_UNAVAILABLE" | "TODO_GATEWAY_INVALID_RESPONSE";
	readonly message: string;
};

export type ListTodosResult =
	| {
			readonly success: true;
			readonly todos: readonly Todo[];
	  }
	| {
			readonly success: false;
			readonly error: TodoGatewayError;
	  };

export type TodoGateway = {
	listTodos(): Promise<ListTodosResult>;
};
