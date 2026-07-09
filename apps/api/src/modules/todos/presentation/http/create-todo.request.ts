import { z } from "zod";

export const createTodoRequestSchema = z.object({
	title: z.string().trim().min(1).max(120),
});

export type CreateTodoRequest = z.infer<typeof createTodoRequestSchema>;
