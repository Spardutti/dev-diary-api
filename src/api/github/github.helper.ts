import jwt from "jsonwebtoken";
import axios from "axios";
import { readFileSync } from "fs";
import path from "path";
import GitHubConfig from "./github.model";
import { decodeHashId } from "../helpers/hashid";
import { ICommit } from "./github.types";

const APP_ID = process.env.GITHUB_CLIENT_APP_ID!;
const privateKeyPath = process.env.NODE_ENV !== "development" ? "/etc/secrets/github-private-key.pem" : path.join(process.cwd(), "github-private-key.pem");
const privateKey = readFileSync(privateKeyPath, "utf8");

const generateGitHubAppToken = async ({ installationId }: { installationId: string }): Promise<any> => {
	try {
		const payload = {
			iat: Math.floor(Date.now() / 1000) - 60,
			exp: Math.floor(Date.now() / 1000) + 10 * 60,
			iss: APP_ID,
		};

		const jwtToken = jwt.sign(payload, privateKey, { algorithm: "RS256" });

		const response = await axios.post(
			`https://api.github.com/app/installations/${installationId}/access_tokens`,
			{},
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
					Accept: "application/vnd.github.v3+json",
				},
			}
		);

		return response.data.token;
	} catch (error) {
		console.error("Error getting GitHub installation access token:", error);
		throw error;
	}
};
export const getRepoCommits = async (date: string, projectId: string): Promise<ICommit[] | { error: string }> => {
	try {
		if (!date || !projectId) {
			return { error: "Date and projectId are required" };
		}

		const config = await GitHubConfig.findOne({ where: { projectId: decodeHashId(projectId) } });

		if (!config) {
			return { error: "GitHub config not found" };
		}

		const { installationId, owner, repo, author } = config;
		const token = await generateGitHubAppToken({ installationId });

		const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?author=${author}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/vnd.github.v3+json",
			},
			params: { since: `${date}T00:00:00Z`, until: `${date}T23:59:59Z` },
		});

		const commits: ICommit[] = response.data.map((commit: { sha: string; commit: { message: string; author: { date: string; name: string } } }) => ({
			sha: commit.sha,
			message: commit.commit.message,
			date: commit.commit.author.date,
			author: commit.commit.author.name,
		}));

		return commits;
	} catch (error) {
		return { error: error instanceof Error ? error.message : "An unknown error occurred" };
	}
};
