import { InferAttributes } from "sequelize";
import Snippet from "./snippet.model";

export const snippetSerializer = (input: Snippet | Snippet[]): Partial<Snippet> | Partial<Snippet>[] => {
	const serialize = (snippet: Snippet): InferAttributes<Snippet, { omit: "hashId" | "userHashId" }> => ({
		id: snippet.hashId,
		title: snippet.title,
		description: snippet.description,
		code: snippet.code,
		userId: snippet.userHashId,
		createdAt: snippet.createdAt,
		updatedAt: snippet.updatedAt,
		language: snippet.language,
	});

	return Array.isArray(input) ? input.map(serialize) : serialize(input);
};
