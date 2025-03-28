import GitHubConfig from "./github.model";
import { InferAttributes } from "sequelize";

type SerializedGitHubConfig = InferAttributes<GitHubConfig, { omit: "hashId" | "projectHashId" }>;

export const githubSerializer = (input: GitHubConfig | GitHubConfig[]): SerializedGitHubConfig | SerializedGitHubConfig[] => {
    const serialize = (github: GitHubConfig): SerializedGitHubConfig => ({
        id: github.hashId,
        projectId: github.projectHashId,
        owner: github.owner,
        repo: github.repo,
        installationId: github.installationId,
        author: github.author,
        createdAt: github.createdAt,
        updatedAt: github.updatedAt,
    });

    return Array.isArray(input) ? input.map(serialize) : serialize(input);
};
