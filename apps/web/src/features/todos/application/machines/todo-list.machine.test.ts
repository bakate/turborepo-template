import { faker } from "@faker-js/faker";
import { assert, describe, expect, it } from "vitest";
import { createActor, waitFor } from "xstate";

import { parseTodo, type Todo } from "../../model/todo";
import { todoListMachine } from "./todo-list.machine";

describe("todoListMachine", () => {
	it("loads todos through the injected gateway", async () => {
		const todoTitle = faker.lorem.words({ min: 2, max: 5 });
		const actor = createActor(todoListMachine, {
			input: {
				todoGateway: {
					async listTodos() {
						return {
							success: true,
							todos: [createTodoFixture({ title: todoTitle })],
						};
					},
					async createTodo({ title }) {
						return {
							success: true,
							todo: createTodoFixture({ title }),
						};
					},
				},
			},
		});

		actor.start();
		actor.send({ type: "TODOS.LOAD" });

		const snapshot = await waitFor(actor, (state) => state.matches("ready"));

		expect(snapshot.context.todos).toHaveLength(1);
		expect(snapshot.context.todos[0]?.title).toBe(todoTitle);
		actor.stop();
	});

	it("moves to failed when the gateway returns an application error", async () => {
		const errorMessage = faker.lorem.sentence();
		const actor = createActor(todoListMachine, {
			input: {
				todoGateway: {
					async listTodos() {
						return {
							success: false,
							error: {
								code: "TODO_GATEWAY_UNAVAILABLE",
								message: errorMessage,
							},
						};
					},
					async createTodo({ title }) {
						return {
							success: true,
							todo: createTodoFixture({ title }),
						};
					},
				},
			},
		});

		actor.start();
		actor.send({ type: "TODOS.LOAD" });

		const snapshot = await waitFor(actor, (state) => state.matches("failed"));

		expect(snapshot.context.errorMessage).toBe(errorMessage);
		actor.stop();
	});
});

function createTodoFixture({
	title = faker.lorem.words({ min: 2, max: 5 }),
}: {
	readonly title?: string;
} = {}): Todo {
	const result = parseTodo({
		input: {
			id: faker.string.uuid(),
			title,
			completed: false,
			createdAt: faker.date.recent(),
			updatedAt: null,
		},
	});

	assert(result.success);
	return result.todo;
}
