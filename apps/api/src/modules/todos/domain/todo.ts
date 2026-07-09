import { failure, type Result, success } from "../../../shared/result";

export type TodoError = {
	readonly code: "INVALID_TODO_TITLE";
	readonly message: string;
};

type TodoProperties = {
	readonly id: string;
	readonly title: string;
	readonly completed: boolean;
	readonly createdAt: Date;
	readonly updatedAt: Date | null;
};

type CreateTodoParams = {
	readonly id: string;
	readonly title: string;
	readonly now: Date;
};

export type TodoSnapshot = {
	readonly id: string;
	readonly title: string;
	readonly completed: boolean;
	readonly createdAt: string;
	readonly updatedAt: string | null;
};

export class Todo {
	private constructor(private readonly properties: TodoProperties) {}

	static create({ id, title, now }: CreateTodoParams): Result<Todo, TodoError> {
		const normalizedTitle = title.trim();

		if (normalizedTitle.length === 0) {
			return failure({
				error: {
					code: "INVALID_TODO_TITLE",
					message: "Todo title cannot be empty.",
				},
			});
		}

		return success({
			value: new Todo({
				id,
				title: normalizedTitle,
				completed: false,
				createdAt: now,
				updatedAt: null,
			}),
		});
	}

	get id(): string {
		return this.properties.id;
	}

	toSnapshot(): TodoSnapshot {
		return {
			id: this.properties.id,
			title: this.properties.title,
			completed: this.properties.completed,
			createdAt: this.properties.createdAt.toISOString(),
			updatedAt: this.properties.updatedAt?.toISOString() ?? null,
		};
	}
}
