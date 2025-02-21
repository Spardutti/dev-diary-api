import z from "zod";
import { InferAttributes } from "sequelize";
import Snippet from "./snippet.model";

type SnippetAttributes = Omit<InferAttributes<Snippet>, "id" | "createdAt" | "updatedAt" | "hashId" | "userHashId" | "userId">;

export const createSnippetSchema: z.ZodType<SnippetAttributes> = z.object({
	title: z.string(),
	description: z.string(),
	code: z.string(),
	language: z.string(),
});

export type CreateSnippet = z.infer<typeof createSnippetSchema>;
