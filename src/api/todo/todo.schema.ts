import z from "zod";

export const createTodoSchema = z.object({
	title: z.string().min(2, "Title must be at least 2 characters"),
	projectId: z.string().min(2),
});
