import { createResponse } from "../helpers/responseHelper";
import Note from "./note.model";
import dayjs from "dayjs";
import { Request, Response } from "express";
import { Op } from "sequelize";
import { decodeHashId } from "../helpers/hashid";
import { noteSerializer } from "./note.serializer";

const create = async (req: Request, res: Response): Promise<any> => {
	try {
		const { title, content, projectId } = req.body;

		const todayStart = dayjs().startOf("day").toDate();
		const todayEnd = dayjs().endOf("day").toDate();

		const existingNote = await Note.findOne({
			where: {
				createdAt: {
					[Op.between]: [todayStart, todayEnd],
				},
				projectId: decodeHashId(projectId),
			},
		});

		if (existingNote) {
			return res.status(400).json({ error: "A note for today already exists" });
		}

		const note = await Note.create({
			title,
			content,
			projectId: decodeHashId(projectId),
			createdAt: new Date(),
		});

		res.status(201).json(createResponse(201, noteSerializer(note)));
	} catch (error) {
		res.status(500).json({ error: "Failed to create note" });
	}
};

const list = async (req: Request, res: Response): Promise<any> => {
	try {
		const { orderBy, orderDirection, ...filters } = req.query;

		const order: [string, string][] = [];

		if (orderBy && typeof orderBy === "string") {
			const direction = orderDirection === "asc" ? "ASC" : "DESC";
			order.push([orderBy, direction]);
		} else {
			order.push(["createdAt", "DESC"]);
		}

		const projectId = filters?.projectId ? decodeHashId(filters.projectId as string) : undefined;

		const notes = await Note.findAll({
			where: { ...filters, projectId },
			order,
		});

		res.status(200).json(createResponse(200, noteSerializer(notes)));
	} catch (error) {
		res.status(500).json({ error: "Failed to list notes" });
	}
};

const update = async (req: Request, res: Response): Promise<any> => {
	try {
		const { title, content } = req.body;
		const { id } = req.params;

		const note = await Note.findByPk(decodeHashId(id));
		if (!note) {
			return res.status(404).json({ error: "Note not found" });
		}

		await note.update({ title, content });

		res.status(200).json(createResponse(200, noteSerializer(note)));
	} catch (error) {
		res.status(500).json({ error: "Failed to update note" });
	}
};

const show = async (req: Request, res: Response): Promise<any> => {
	try {
		const { noteId } = req.params;

		const note = await Note.findByPk(decodeHashId(noteId));

		if (!note) {
			return res.status(404).json({ error: "Note not found" });
		}

		res.status(200).json(createResponse(200, noteSerializer(note)));
	} catch (error) {
		res.status(500).json({ error: "Failed to show note" });
	}
};

export const notesController = {
	create,
	show,
	list,
	update,
};
