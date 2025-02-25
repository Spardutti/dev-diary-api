import z from "zod";

export const createSummarySchema = z.object({
	date: z.string(),
	projectId: z.string(),
});
