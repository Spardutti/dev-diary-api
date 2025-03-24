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

const list = async (req: Request, res: Response): Promise<any> => {
	try {
		const configs = await GitHubConfig.findAll();

		return res.json(createResponse(200, githubSerializer(configs)));
	} catch (error) {
		return res.json(createResponse(400, { message: "Error listing GitHub configs", error }));
	}
};

const update = async (req: Request, res: Response): Promise<any> => {
	try {
		const { id } = req.params;
		const { installationId, repo, owner, author, projectId } = req.body;

		const config = await GitHubConfig.findOne({ where: { id: decodeHashId(id) } });

		if (!config) {
			return res.json(createResponse(400, { message: "GitHub config not found" }));
		}

		await config.update({
			installationId,
			repo,
			owner,
			author,
			projectId: decodeHashId(projectId),
		});

		return res.json(createResponse(200, githubSerializer(config)));
	} catch (error) {
		return res.json(createResponse(400, { message: "Error updating GitHub config", error }));
	}
};

const remove = async (req: Request, res: Response): Promise<any> => {
	try {
		const { id } = req.params;

		const config = await GitHubConfig.findOne({ where: { id: decodeHashId(id) } });

		if (!config) {
			return res.json(createResponse(400, { message: "GitHub config not found" }));
		}

		await config.destroy();

		return res.json(createResponse(204));
	} catch (error) {
		return res.json(createResponse(400, { message: "Error deleting GitHub config", error }));
	}
};

export const githubController = {
	create,
	remove,
	list,
	update,
};
