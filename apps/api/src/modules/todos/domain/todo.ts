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

	get title(): string {
		return this.properties.title;
	}

	get completed(): boolean {
		return this.properties.completed;
	}

	get createdAt(): Date {
		return new Date(this.properties.createdAt);
	}

	get updatedAt(): Date | null {
		const { updatedAt } = this.properties;

		return updatedAt === null ? null : new Date(updatedAt);
	}
}
