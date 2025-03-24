import jwt from "jsonwebtoken";
import axios from "axios";
import { readFileSync } from "fs";
import path from "path";
import GitHubConfig from "./github.model";
import { decodeHashId } from "../helpers/hashid";
import { ICommit } from "./github.types";
import dayjs from "dayjs";

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

const getOpenPrs = async ({ owner, repo, token }: { owner: string; repo: string; token: string }): Promise<{ openPrsNumber: number[] }> => {
	const response = await axios.get<{ number: number }[]>(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/vnd.github.v3+json",
		},
		params: {
			state: "open",
			per_page: 10,
		},
	});

	return { openPrsNumber: response.data.map((pr) => pr.number) };
};

const getFirstPrWhereUserHasCommits = async ({ openPrsNumber, owner, repo, author, token }: { openPrsNumber: number[]; owner: string; repo: string; author: string; token: string }) => {
	let userPRNumber: number | null = null;

	for (const prNumber of openPrsNumber) {
		const commitsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/commits`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/vnd.github.v3+json",
			},
		});

		// Check if the commit author matches you
		const hasYourCommits = commitsResponse.data.some((commit: { author: { login: string } }) => commit.author?.login === author);

		if (hasYourCommits) {
			userPRNumber = prNumber;
			break; // Stop once we find a PR with your commits
		}
	}

	return { userPRNumber };
};

export const getRepoCommits = async (date: string, projectId: string): Promise<ICommit[] | { error: string }> => {
	try {
		if (!date || !projectId) {
			return { error: "Date and projectId are required" };
		}
		const formattedDate = dayjs(date).format("YYYY-MM-DD");

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
			params: { since: `${formattedDate}T00:00:00Z`, until: `${formattedDate}T23:59:59Z` },
		});

		const { openPrsNumber } = await getOpenPrs({ owner, repo, token });

		const { userPRNumber } = await getFirstPrWhereUserHasCommits({ owner, repo, author, token, openPrsNumber });

		let prCommits = [];

		if (userPRNumber) {
			const commitsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${userPRNumber}/commits`, {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/vnd.github.v3+json",
				},
			});

			prCommits = commitsResponse.data;
		}

		const commits: ICommit[] = [...response.data, ...prCommits].map((commit: { sha: string; commit: { message: string; author: { date: string; name: string } } }) => ({
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
