import { Request, Response } from "express";
import { getSummaryForDate } from "./summary.helper";
import dayjs from "dayjs";
import { createResponse } from "../helpers/responseHelper";
import Summary from "./summary.model";
import { summarySerializer } from "./summary.serializer";
import { decodeHashId } from "../helpers/hashid";
import { Op } from "sequelize";

const create = async (req: Request, res: Response): Promise<any> => {
	try {
		const { projectId, date } = req.body;

		if (!date || typeof date !== "string") {
			return res.status(400).json({ error: "Invalid date" });
		}

		if (!projectId) {
			return res.status(400).json({ error: "ProjectId is required" });
		}

		const formattedDate = dayjs(date);
		const startOfDay = formattedDate.startOf("day").toDate();
		const endOfDay = formattedDate.endOf("day").toDate();

		const existingSummary = await Summary.findOne({
			where: { projectId: decodeHashId(projectId), createdAt: { [Op.between]: [startOfDay, endOfDay] } },
		});

		if (existingSummary) {
			return res.status(409).json({ message: "Summary for this date already exists." });
		}
		const { note, completedTodos, createdTodos } = await getSummaryForDate(formattedDate);

		const summary = await Summary.create({ noteContent: note?.content, completedTodos, createdTodos, projectId: decodeHashId(projectId), createdAt: formattedDate.toDate() });

		return res.json(createResponse(201, summarySerializer(summary)));
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

const list = async (req: Request, res: Response): Promise<any> => {
	try {
		const { projectId } = req.query;

		if (!projectId) {
			return res.status(400).json({ error: "projectId is required" });
		}
		const summaries = await Summary.findAll({ where: { projectId: decodeHashId(projectId as string) } });

		if (summaries.length === 0) {
			return res.status(200).json({ message: "No summary found" });
		}

		res.json(createResponse(200, summarySerializer(summaries)));
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

export const summaryController = { list, create };
