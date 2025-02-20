import z from "zod";

export const createTodoSchema = z.object({
	title: z.string(),
	projectId: z.string(),
	priority: z.number().min(0).max(3),
	status: z.boolean(),
});
