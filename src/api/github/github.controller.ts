import { Request, Response } from "express";
import { createResponse } from "../helpers/responseHelper";

import GitHubConfig from "./github.model";
import { decodeHashId } from "../helpers/hashid";
import { githubSerializer } from "./github.serializer";

const create = async (req: Request, res: Response): Promise<any> => {
	try {
		const { installationId, repo, owner, author, projectId } = req.body;

		const config = await GitHubConfig.create({
			installationId,
			repo,
			owner,
			author,
			projectId: decodeHashId(projectId),
		});

		return res.json(createResponse(201, githubSerializer(config)));
	} catch (error) {
		return res.json(createResponse(400, { message: "Error creating GitHub config", error }));
	}
};

export const githubController = {
	create,
};
