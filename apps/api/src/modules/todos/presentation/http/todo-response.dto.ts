import type { Todo } from "../../domain/todo";

export type TodoResponseDto = {
	readonly id: string;
	readonly title: string;
	readonly completed: boolean;
	readonly createdAt: string;
	readonly updatedAt: string | null;
};

export type CreateTodoResponseDto = {
	readonly todo: TodoResponseDto;
};

export type ListTodosResponseDto = {
	readonly todos: readonly TodoResponseDto[];
};

export function toTodoResponseDto({
	todo,
}: {
	readonly todo: Todo;
}): TodoResponseDto {
	return {
		id: todo.id,
		title: todo.title,
		completed: todo.completed,
		createdAt: todo.createdAt.toISOString(),
		updatedAt: todo.updatedAt?.toISOString() ?? null,
	};
}
