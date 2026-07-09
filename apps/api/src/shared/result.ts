export type SuccessResult<TValue> = {
	readonly success: true;
	readonly value: TValue;
};

export type FailureResult<TError extends { readonly message: string }> = {
	readonly success: false;
	readonly error: TError;
};

export type Result<TValue, TError extends { readonly message: string }> =
	| SuccessResult<TValue>
	| FailureResult<TError>;

export function success<TValue>({
	value,
}: {
	readonly value: TValue;
}): SuccessResult<TValue> {
	return {
		success: true,
		value,
	};
}

export function failure<TError extends { readonly message: string }>({
	error,
}: {
	readonly error: TError;
}): FailureResult<TError> {
	return {
		success: false,
		error,
	};
}
