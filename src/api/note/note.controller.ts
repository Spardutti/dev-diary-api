import { createResponse } from "../helpers/responseHelper";
import Note from "./note.model";
import dayjs from "dayjs";
import { Request, Response } from "express";
import { Op } from "sequelize";

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
				projectId,
			},
		});

		if (existingNote) {
			return res.status(400).json({ error: "A note for today already exists" });
		}

		const note = await Note.create({
			title,
			content,
			projectId,
			createdAt: new Date(),
		});

		res.status(201).json(createResponse(201, note));
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

		const notes = await Note.findAll({
			where: filters,
			order,
		});

		res.status(200).json(createResponse(200, notes));
	} catch (error) {
		res.status(500).json({ error: "Failed to list notes" });
	}
};

const update = async (req: Request, res: Response): Promise<any> => {
	try {
		const { title, content } = req.body;
		const { id } = req.params;

		const note = await Note.findByPk(id);
		if (!note) {
			return res.status(404).json({ error: "Note not found" });
		}

		await note.update({ title, content });

		res.status(200).json(createResponse(200, note));
	} catch (error) {
		res.status(500).json({ error: "Failed to update note" });
	}
};

const show = async (req: Request, res: Response): Promise<any> => {
	try {
		const { date, projectId } = req.params;

		const dayStart = dayjs(date).startOf("day").toDate();
		const dayEnd = dayjs(date).endOf("day").toDate();

		const note = await Note.findOne({
			where: {
				createdAt: {
					[Op.between]: [dayStart, dayEnd],
				},
				projectId,
			},
		});
		if (!note) {
			return res.status(404).json({ error: "Note not found" });
		}

		res.status(200).json(createResponse(200, note));
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
