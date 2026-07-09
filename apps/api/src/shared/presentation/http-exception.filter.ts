import {
	type ArgumentsHost,
	Catch,
	type ExceptionFilter,
	HttpException,
	HttpStatus,
} from "@nestjs/common";

import {
	type ApiErrorBody,
	createApiErrorBody,
	isApiErrorBody,
} from "./api-error";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost): void {
		const response = host.switchToHttp().getResponse<HttpResponse>();
		const statusCode = getStatusCode({ exception });
		const errorBody = getErrorBody({ exception, statusCode });

		response.status(statusCode).json(errorBody);
	}
}

type HttpResponse = {
	status(statusCode: number): {
		json(body: ApiErrorBody): void;
	};
};

function getStatusCode({ exception }: { readonly exception: unknown }): number {
	if (exception instanceof HttpException) {
		return exception.getStatus();
	}

	return HttpStatus.INTERNAL_SERVER_ERROR;
}

function getErrorBody({
	exception,
	statusCode,
}: {
	readonly exception: unknown;
	readonly statusCode: number;
}): ApiErrorBody {
	if (!(exception instanceof HttpException)) {
		return createApiErrorBody({
			code: "INTERNAL_SERVER_ERROR",
			message: "Internal server error.",
		});
	}

	const response = exception.getResponse();

	if (isApiErrorBody(response)) {
		return response;
	}

	if (statusCode === HttpStatus.BAD_REQUEST) {
		return createApiErrorBody({
			code: "VALIDATION_FAILED",
			message: "Request validation failed.",
		});
	}

	if (statusCode === HttpStatus.NOT_FOUND) {
		return createApiErrorBody({
			code: "NOT_FOUND",
			message: "Resource not found.",
		});
	}

	if (statusCode === HttpStatus.TOO_MANY_REQUESTS) {
		return createApiErrorBody({
			code: "RATE_LIMIT_EXCEEDED",
			message: "Rate limit exceeded.",
		});
	}

	if (statusCode >= 400 && statusCode < 500) {
		return createApiErrorBody({
			code: "HTTP_ERROR",
			message: "HTTP request failed.",
		});
	}

	return createApiErrorBody({
		code: "INTERNAL_SERVER_ERROR",
		message: "Internal server error.",
	});
}
