import type {
	CreateTodoCommand,
	CreateTodoResult,
	ListTodosResult,
	TodoGateway,
} from "../../application/ports/todo-gateway";
import { type ParseTodoResult, parseTodo } from "../../model/todo";

type ListTodosResponse = {
	readonly todos: readonly unknown[];
};

type CreateTodoResponse = {
	readonly todo: unknown;
};

export class TodoHttpGateway implements TodoGateway {
	async listTodos(): Promise<ListTodosResult> {
		try {
			const response = await fetch("/api/todos");

			if (!response.ok) {
				return createListTodosUnavailableResult();
			}

			const body = (await response.json()) as Partial<ListTodosResponse>;

			if (!Array.isArray(body.todos)) {
				return createListTodosInvalidResponseResult();
			}

			const todos = body.todos.map((todo) => parseTodo({ input: todo }));
			const invalidTodo = todos.find((todo) => !todo.success);

			if (invalidTodo !== undefined) {
				return createListTodosInvalidResponseResult();
			}

			return {
				success: true,
				todos: todos.filter(isParsedTodo).map((todo) => todo.todo),
			};
		} catch {
			return createListTodosUnavailableResult();
		}
	}

	async createTodo({ title }: CreateTodoCommand): Promise<CreateTodoResult> {
		try {
			const response = await fetch("/api/todos", {
				body: JSON.stringify({ title }),
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
			});

			if (!response.ok) {
				return createTodoUnavailableResult();
			}

			const body = (await response.json()) as Partial<CreateTodoResponse>;
			const result = parseTodo({ input: body.todo });

			if (!result.success) {
				return createTodoInvalidResponseResult();
			}

			return {
				success: true,
				todo: result.todo,
			};
		} catch {
			return createTodoUnavailableResult();
		}
	}
}

function isParsedTodo(
	result: ParseTodoResult,
): result is Extract<ParseTodoResult, { readonly success: true }> {
	return result.success;
}

function createListTodosUnavailableResult(): ListTodosResult {
	return {
		success: false,
		error: {
			code: "TODO_GATEWAY_UNAVAILABLE",
			message: "Todo API is unavailable.",
		},
	};
}

function createListTodosInvalidResponseResult(): ListTodosResult {
	return {
		success: false,
		error: {
			code: "TODO_GATEWAY_INVALID_RESPONSE",
			message: "Todo API returned an invalid response.",
		},
	};
}

function createTodoUnavailableResult(): CreateTodoResult {
	return {
		success: false,
		error: {
			code: "TODO_GATEWAY_UNAVAILABLE",
			message: "Todo API is unavailable.",
		},
	};
}

function createTodoInvalidResponseResult(): CreateTodoResult {
	return {
		success: false,
		error: {
			code: "TODO_GATEWAY_INVALID_RESPONSE",
			message: "Todo API returned an invalid response.",
		},
	};
}
