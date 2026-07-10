import type { Todo } from "../../model/todo";

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

export type CreateTodoCommand = {
	readonly title: string;
};

export type CreateTodoResult =
	| {
			readonly success: true;
			readonly todo: Todo;
	  }
	| {
			readonly success: false;
			readonly error: TodoGatewayError;
	  };

export type TodoGateway = {
	listTodos(): Promise<ListTodosResult>;
	createTodo(params: CreateTodoCommand): Promise<CreateTodoResult>;
};
