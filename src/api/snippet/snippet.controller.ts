import { createResponse } from "../helpers/responseHelper";
import { Request, Response } from "express";
import { decodeHashId } from "../helpers/hashid";
import Snippet from "./snippet.model";
import User from "../user/user.model";
import { snippetSerializer } from "./snippet.serializer";

const create = async (req: Request, res: Response): Promise<any> => {
	try {
		const { title, description, code, language } = req.body;

		const user = req.user as User;

		const snippet = await Snippet.create({ title, description, code, userId: user.id, language });

		res.status(201).json(createResponse(201, snippetSerializer(snippet)));
	} catch (error) {
		res.status(500).json({ message: "Failed to create snippet", error });
	}
};

const list = async (req: Request, res: Response): Promise<any> => {
	try {
		const user = req.user as User;

		const snippets = await Snippet.findAll({ where: { userId: user.id } });

		res.status(200).json(createResponse(200, snippetSerializer(snippets)));
	} catch (error) {
		res.status(500).json({ message: "Failed to list snippets", error });
	}
};

const show = async (req: Request, res: Response): Promise<any> => {
	try {
		const { id } = req.params;

		const snippet = await Snippet.findByPk(decodeHashId(id));

		if (!snippet) {
			return res.status(404).json({ error: "Snippet not found" });
		}

		res.status(200).json(createResponse(200, snippetSerializer(snippet)));
	} catch (error) {
		res.status(500).json({ message: "Failed to show snippet", error });
	}
};

const update = async (req: Request, res: Response): Promise<any> => {
	try {
		const { id } = req.params;
		const { title, description, code, language } = req.body;

		const snippet = await Snippet.findByPk(decodeHashId(id));

		if (!snippet) {
			return res.status(404).json({ error: "Snippet not found" });
		}

		await snippet.update({ title, description, code, language });

		res.status(200).json(createResponse(200, snippetSerializer(snippet)));
	} catch (error) {
		res.status(500).json({ message: "Failed to update snippet", error });
	}
};

const remove = async (req: Request, res: Response): Promise<any> => {
	try {
		const { id } = req.params;

		const snippet = await Snippet.findByPk(decodeHashId(id));

		if (!snippet) {
			return res.status(404).json({ error: "Snippet not found" });
		}

		await snippet.destroy();

		res.status(200).json(createResponse(200));
	} catch (error) {
		res.status(500).json({ message: "Failed to delete snippet", error });
	}
};

export const snippetController = {
	create,
	list,
	show,
	update,
	remove,
};
