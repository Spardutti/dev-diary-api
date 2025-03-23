import z from "zod";
import GitHubConfig from "./github.model";
import { InferAttributes } from "sequelize";

type GithubConfigAttributes = Omit<InferAttributes<GitHubConfig>, "id" | "createdAt" | "updatedAt" | "hashId" | "projectHashId" | "installationHashId">;

export const createGithubConfigSchema: z.ZodType<GithubConfigAttributes> = z.object({
	owner: z.string(),
	repo: z.string(),
	installationId: z.string(),
	author: z.string(),
	projectId: z.string(),
});
