export type ApiErrorCode =
	| "HTTP_ERROR"
	| "INTERNAL_SERVER_ERROR"
	| "INVALID_TODO_TITLE"
	| "NOT_FOUND"
	| "RATE_LIMIT_EXCEEDED"
	| "VALIDATION_FAILED";

export type ApiErrorDetail = {
	readonly path?: readonly PropertyKey[];
	readonly message: string;
};

export type ApiErrorBody = {
	readonly error: {
		readonly code: ApiErrorCode;
		readonly message: string;
		readonly details?: readonly ApiErrorDetail[];
	};
};

export function createApiErrorBody({
	code,
	message,
	details,
}: {
	readonly code: ApiErrorCode;
	readonly message: string;
	readonly details?: readonly ApiErrorDetail[];
}): ApiErrorBody {
	if (details === undefined) {
		return {
			error: {
				code,
				message,
			},
		};
	}

	return {
		error: {
			code,
			message,
			details,
		},
	};
}

export function isApiErrorBody(value: unknown): value is ApiErrorBody {
	if (!isRecord(value)) {
		return false;
	}

	if (!isRecord(value.error)) {
		return false;
	}

	return (
		typeof value.error.code === "string" &&
		typeof value.error.message === "string"
	);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}
