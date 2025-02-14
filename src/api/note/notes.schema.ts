import z from "zod";

export const createNoteSchema = z.object({
	title: z.string().min(2, "Title must be at least 2 characters"),
	content: z.string().min(2, "Content must be at least 2 characters"),
	projectId: z.string().uuid("Invalid project ID"),
});

export const updateNoteSchema = z.object({
	title: z.string().min(2, "Title must be at least 2 characters"),
	content: z.string().min(2, "Content must be at least 2 characters"),
});
