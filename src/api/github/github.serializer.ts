import GitHubConfig from "./github.model";
import { InferAttributes } from "sequelize";

export const githubSerializer = (input: GitHubConfig): Partial<GitHubConfig> => {
	const serialize = (github: GitHubConfig): InferAttributes<GitHubConfig, { omit: "hashId" | "projectHashId" | "installationHashId" }> => ({
		id: github.hashId,
		projectId: github.projectHashId,
		owner: github.owner,
		repo: github.repo,
		installationId: github.installationHashId,
		author: github.author,
		createdAt: github.createdAt,
		updatedAt: github.updatedAt,
	});

	return serialize(input);
};
