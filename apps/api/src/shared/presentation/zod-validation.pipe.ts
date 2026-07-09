import { BadRequestException, type PipeTransform } from "@nestjs/common";
import type { z } from "zod";

import { createApiErrorBody } from "./api-error";

type ValidationIssue = {
	readonly path: readonly PropertyKey[];
	readonly message: string;
};

export class ZodValidationPipe<TOutput>
	implements PipeTransform<unknown, TOutput>
{
	constructor(private readonly schema: z.ZodType<TOutput>) {}

	transform(value: unknown): TOutput {
		const result = this.schema.safeParse(value);

		if (result.success) {
			return result.data;
		}

		throw new BadRequestException(
			createApiErrorBody({
				code: "VALIDATION_FAILED",
				message: "Request validation failed.",
				details: result.error.issues.map(toValidationIssue),
			}),
		);
	}
}

function toValidationIssue(issue: z.core.$ZodIssue): ValidationIssue {
	return {
		path: issue.path,
		message: issue.message,
	};
}
