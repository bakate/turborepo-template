import type { Todo } from "../../domain/todo";

export const TODO_REPOSITORY = Symbol("TODO_REPOSITORY");

export type TodoRepository = {
	save(params: { readonly todo: Todo }): Promise<void>;
	findAll(): Promise<readonly Todo[]>;
};
