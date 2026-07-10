import { faker } from "@faker-js/faker";
import { assert, describe, expect, it } from "vitest";
import { createActor, waitFor } from "xstate";

import { parseTodo, type Todo } from "../../model/todo";
import { createTodoMachine } from "./create-todo.machine";

describe("createTodoMachine", () => {
	it("creates a todo through the injected gateway", async () => {
		const todoTitle = faker.lorem.words({ min: 2, max: 5 });
		const actor = createActor(createTodoMachine, {
			input: {
				todoGateway: {
					async listTodos() {
						return { success: true, todos: [] };
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
		actor.send({ type: "TODO.CREATE", title: todoTitle });

		const snapshot = await waitFor(actor, (state) =>
			state.matches("succeeded"),
		);

		expect(snapshot.context.createdTodo?.title).toBe(todoTitle);
		expect(snapshot.context.errorMessage).toBeNull();
		actor.stop();
	});

	it("moves to failed when the gateway returns an application error", async () => {
		const errorMessage = faker.lorem.sentence();
		const actor = createActor(createTodoMachine, {
			input: {
				todoGateway: {
					async listTodos() {
						return { success: true, todos: [] };
					},
					async createTodo() {
						return {
							success: false,
							error: {
								code: "TODO_GATEWAY_UNAVAILABLE",
								message: errorMessage,
							},
						};
					},
				},
			},
		});

		actor.start();
		actor.send({
			type: "TODO.CREATE",
			title: faker.lorem.words({ min: 2, max: 5 }),
		});

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
