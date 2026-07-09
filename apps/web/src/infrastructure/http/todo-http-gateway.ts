import type {
	ListTodosResult,
	TodoGateway,
} from "@workspace/application/todos/ports/todo-gateway";
import { type ParseTodoResult, parseTodo } from "@workspace/domain/todos";

type ListTodosResponse = {
	readonly todos: readonly unknown[];
};

export class TodoHttpGateway implements TodoGateway {
	async listTodos(): Promise<ListTodosResult> {
		try {
			const response = await fetch("/api/todos");

			if (!response.ok) {
				return createUnavailableResult();
			}

			const body = (await response.json()) as Partial<ListTodosResponse>;

			if (!Array.isArray(body.todos)) {
				return createInvalidResponseResult();
			}

			const todos = body.todos.map((todo) => parseTodo({ input: todo }));
			const invalidTodo = todos.find((todo) => !todo.success);

			if (invalidTodo !== undefined) {
				return createInvalidResponseResult();
			}

			return {
				success: true,
				todos: todos.filter(isParsedTodo).map((todo) => todo.todo),
			};
		} catch {
			return createUnavailableResult();
		}
	}
}

function isParsedTodo(
	result: ParseTodoResult,
): result is Extract<ParseTodoResult, { readonly success: true }> {
	return result.success;
}

function createUnavailableResult(): ListTodosResult {
	return {
		success: false,
		error: {
			code: "TODO_GATEWAY_UNAVAILABLE",
			message: "Todo API is unavailable.",
		},
	};
}

function createInvalidResponseResult(): ListTodosResult {
	return {
		success: false,
		error: {
			code: "TODO_GATEWAY_INVALID_RESPONSE",
			message: "Todo API returned an invalid response.",
		},
	};
}
