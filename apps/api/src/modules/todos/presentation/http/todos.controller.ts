import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Inject,
	Post,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { createApiErrorBody } from "../../../../shared/presentation/api-error";
import { ZodValidationPipe } from "../../../../shared/presentation/zod-validation.pipe";
import { CreateTodoUseCase } from "../../application/use-cases/create-todo.use-case";
import { ListTodosUseCase } from "../../application/use-cases/list-todos.use-case";
import type { TodoSnapshot } from "../../domain/todo";
import {
	type CreateTodoRequest,
	createTodoRequestSchema,
} from "./create-todo.request";
import {
	apiErrorOpenApiSchema,
	createTodoBodyOpenApiSchema,
	createTodoResponseOpenApiSchema,
	listTodosResponseOpenApiSchema,
} from "./todos.openapi";

type CreateTodoResponse = {
	readonly todo: TodoSnapshot;
};

type ListTodosResponse = {
	readonly todos: readonly TodoSnapshot[];
};

@ApiTags("Todos")
@Controller("todos")
export class TodosController {
	constructor(
		@Inject(CreateTodoUseCase)
		private readonly createTodoUseCase: CreateTodoUseCase,
		@Inject(ListTodosUseCase)
		private readonly listTodosUseCase: ListTodosUseCase,
	) {}

	@Post()
	@ApiOperation({ summary: "Create a todo" })
	@ApiBody({ schema: createTodoBodyOpenApiSchema })
	@ApiCreatedResponse({
		description: "Todo created.",
		schema: createTodoResponseOpenApiSchema,
	})
	@ApiBadRequestResponse({
		description: "The request body is invalid.",
		schema: apiErrorOpenApiSchema,
	})
	async create(
		@Body(new ZodValidationPipe(createTodoRequestSchema))
		request: CreateTodoRequest,
	): Promise<CreateTodoResponse> {
		const result = await this.createTodoUseCase.execute({
			title: request.title,
		});

		if (!result.success) {
			throw new BadRequestException(
				createApiErrorBody({
					code: result.error.code,
					message: result.error.message,
				}),
			);
		}

		return {
			todo: result.value,
		};
	}

	@Get()
	@ApiOperation({ summary: "List todos" })
	@ApiOkResponse({
		description: "Todos returned.",
		schema: listTodosResponseOpenApiSchema,
	})
	async list(): Promise<ListTodosResponse> {
		return {
			todos: await this.listTodosUseCase.execute(),
		};
	}
}
