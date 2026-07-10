import type { Todo } from "@workspace/domain/todos";
import { assign, fromPromise, setup } from "xstate";

import type { ListTodosResult, TodoGateway } from "../ports/todo-gateway";

type TodoListContext = {
	readonly todos: readonly Todo[];
	readonly errorMessage: string | null;
	readonly todoGateway: TodoGateway;
};

type TodoListInput = { readonly todoGateway: TodoGateway };

type TodoListEvent =
	| { readonly type: "TODOS.LOAD" }
	| { readonly type: "TODOS.RETRY" };

const loadTodosActor = fromPromise(
	async ({
		input,
	}: {
		readonly input: { readonly todoGateway: TodoGateway };
	}): Promise<ListTodosResult> => input.todoGateway.listTodos(),
);

export const todoListMachine = setup({
	types: {
		context: {} as TodoListContext,
		events: {} as TodoListEvent,
		input: {} as TodoListInput,
	},
	actors: { loadTodos: loadTodosActor },
	actions: {
		assignUnexpectedError: assign({
			errorMessage: () => "Unable to load todos.",
		}),
	},
}).createMachine({
	id: "todoList",
	context: ({ input }) => ({
		todos: [],
		errorMessage: null,
		todoGateway: input.todoGateway,
	}),
	initial: "idle",
	states: {
		idle: {
			on: { "TODOS.LOAD": { target: "loading" } },
		},
		loading: {
			tags: ["loading"],
			invoke: {
				src: "loadTodos",
				input: ({ context }) => ({ todoGateway: context.todoGateway }),
				onDone: [
					{
						guard: ({ event }) => event.output.success,
						target: "ready",
						actions: assign(({ event }) => {
							if (!event.output.success) {
								return {};
							}

							return { todos: event.output.todos, errorMessage: null };
						}),
					},
					{
						target: "failed",
						actions: assign(({ event }) => {
							if (event.output.success) {
								return {};
							}

							return { errorMessage: event.output.error.message };
						}),
					},
				],
				onError: {
					target: "failed",
					actions: "assignUnexpectedError",
				},
			},
		},
		ready: {
			on: { "TODOS.LOAD": { target: "loading" } },
		},
		failed: {
			on: { "TODOS.RETRY": { target: "loading" } },
		},
	},
});
