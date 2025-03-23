import jwt from "jsonwebtoken";
import axios from "axios";
import { Request, Response } from "express";
import { createResponse } from "../helpers/responseHelper";
import { readFileSync } from "fs";
import path from "path";
import z from "zod";

const APP_ID = process.env.GITHUB_CLIENT_APP_ID!;
const privateKeyPath = path.join(process.cwd(), "github-private-key.pem");
const privateKey = readFileSync(privateKeyPath, "utf8");

console.log("Private Key Loaded Successfully:", privateKey.startsWith("-----BEGIN RSA PRIVATE KEY-----"));

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

const commitQuerySchema = z.object({
	date: z.string(),
	owner: z.string(),
	repo: z.string(),
	installationId: z.string(),
	author: z.string(),
});

const getRepoCommits = async (req: Request, res: Response): Promise<any> => {
	try {
		const queryResult = commitQuerySchema.safeParse(req.query);

		if (!queryResult.success) {
			const missingParams = queryResult.error.issues.map((issue) => issue.path[0]);
			return res.json(
				createResponse(400, {
					message: `Missing required parameters: ${missingParams.join(", ")}`,
				})
			);
		}

		const { date, owner, repo, installationId, author } = queryResult.data;

		const token = await generateGitHubAppToken({ installationId: installationId as string });

		const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?author=${author}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/vnd.github.v3+json",
			},
			params: { since: `${date}T00:00:00Z`, until: `${date}T23:59:59Z` },
		});

		const commits = response.data.map((commit: any) => {
			return {
				sha: commit.sha,
				message: commit.commit.message,
				date: commit.commit.author.date,
				author: commit.commit.author.name,
			};
		});

		res.json(createResponse(200, commits));
	} catch (error) {
		if (error instanceof Error) {
			return res.json({ status: 500, error: error.message });
		}
		res.json({ status: 500, error: error });
	}
};

export const githubController = {
	getRepoCommits,
};
