import type { Todo } from "@workspace/domain/todos";
import { assign, fromPromise, setup } from "xstate";

import type {
	CreateTodoCommand,
	CreateTodoResult,
	TodoGateway,
} from "../ports/todo-gateway";

type CreateTodoContext = {
	readonly createdTodo: Todo | null;
	readonly errorMessage: string | null;
	readonly submittedTitle: string;
	readonly todoGateway: TodoGateway;
};

type CreateTodoInput = {
	readonly todoGateway: TodoGateway;
};

type CreateTodoEvent =
	| {
			readonly type: "TODO.CREATE";
			readonly title: string;
	  }
	| {
			readonly type: "TODO.RETRY";
	  }
	| {
			readonly type: "TODO.RESET";
	  };

const createTodoActor = fromPromise(
	async ({
		input,
	}: {
		readonly input: {
			readonly command: CreateTodoCommand;
			readonly todoGateway: TodoGateway;
		};
	}): Promise<CreateTodoResult> => input.todoGateway.createTodo(input.command),
);

export const createTodoMachine = setup({
	types: {
		context: {} as CreateTodoContext,
		events: {} as CreateTodoEvent,
		input: {} as CreateTodoInput,
	},
	actors: {
		createTodo: createTodoActor,
	},
	actions: {
		assignSubmittedTitle: assign(({ event }) => {
			if (event.type !== "TODO.CREATE") {
				return {};
			}

			return {
				errorMessage: null,
				submittedTitle: event.title,
			};
		}),
		assignUnexpectedError: assign({
			errorMessage: () => "Unable to create todo.",
		}),
		resetFormState: assign({
			createdTodo: () => null,
			errorMessage: () => null,
			submittedTitle: () => "",
		}),
	},
}).createMachine({
	id: "createTodo",
	context: ({ input }) => ({
		createdTodo: null,
		errorMessage: null,
		submittedTitle: "",
		todoGateway: input.todoGateway,
	}),
	initial: "idle",
	states: {
		idle: {
			on: {
				"TODO.CREATE": {
					target: "submitting",
					actions: "assignSubmittedTitle",
				},
				"TODO.RESET": {
					actions: "resetFormState",
				},
			},
		},
		submitting: {
			tags: ["submitting"],
			invoke: {
				src: "createTodo",
				input: ({ context }) => ({
					command: {
						title: context.submittedTitle,
					},
					todoGateway: context.todoGateway,
				}),
				onDone: [
					{
						guard: ({ event }) => event.output.success,
						target: "succeeded",
						actions: assign(({ event }) => {
							if (!event.output.success) {
								return {};
							}

							return {
								createdTodo: event.output.todo,
								errorMessage: null,
							};
						}),
					},
					{
						target: "failed",
						actions: assign(({ event }) => {
							if (event.output.success) {
								return {};
							}

							return {
								errorMessage: event.output.error.message,
							};
						}),
					},
				],
				onError: {
					target: "failed",
					actions: "assignUnexpectedError",
				},
			},
		},
		succeeded: {
			on: {
				"TODO.CREATE": {
					target: "submitting",
					actions: "assignSubmittedTitle",
				},
				"TODO.RESET": {
					target: "idle",
					actions: "resetFormState",
				},
			},
		},
		failed: {
			on: {
				"TODO.CREATE": {
					target: "submitting",
					actions: "assignSubmittedTitle",
				},
				"TODO.RETRY": {
					target: "submitting",
				},
				"TODO.RESET": {
					target: "idle",
					actions: "resetFormState",
				},
			},
		},
	},
});
