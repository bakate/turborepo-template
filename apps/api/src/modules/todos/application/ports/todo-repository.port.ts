import type { Todo } from "../../domain/todo";

export type TodoRepository = {
	save(params: { readonly todo: Todo }): Promise<void>;
	findAll(): Promise<readonly Todo[]>;
};
