import { Request, Response } from "express";
import { getSummaryForDate } from "./summary.helper";
import dayjs from "dayjs";
import { createResponse } from "../helpers/responseHelper";
import Summary from "./summary.model";
import { summarySerializer } from "./summary.serializer";
import { decodeHashId } from "../helpers/hashid";
import { Op } from "sequelize";
import { parseQueryFilters } from "../helpers/parseQueryFilter";

const createOrUpdate = async (req: Request, res: Response): Promise<any> => {
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

		let summary = await Summary.findOne({
			where: {
				projectId: decodeHashId(projectId),
				createdAt: { [Op.between]: [startOfDay, endOfDay] },
			},
		});

		const { completedTodos, createdTodos } = await getSummaryForDate(formattedDate, projectId);

		if (completedTodos.length === 0 && createdTodos.length === 0) {
			return res.json({ message: "No todos found for the specific date" });
		}

		if (summary) {
			await summary.update({ completedTodos, createdTodos });
		} else {
			summary = await Summary.create({
				completedTodos,
				createdTodos,
				projectId: decodeHashId(projectId),
				createdAt: formattedDate.toDate(),
			});
		}

		return res.json(createResponse(200, summarySerializer(summary)));
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

		const { filters, order } = parseQueryFilters(req.query);

		const summaries = await Summary.findAll({
			where: filters,
			order,
		});

		if (summaries.length === 0) {
			return res.status(200).json({ message: "No summary found" });
		}

		res.json(createResponse(200, summarySerializer(summaries)));
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

const remove = async (req: Request, res: Response): Promise<any> => {
	try {
		const { id } = req.params;

		const summary = await Summary.findByPk(decodeHashId(id));

		if (!summary) {
			return res.status(404).json({ message: "Summary not found" });
		}

		await summary.destroy();

		res.json(createResponse(204));
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

const show = async (req: Request, res: Response): Promise<any> => {
	try {
		const { id } = req.params;

		const summary = await Summary.findByPk(decodeHashId(id));

		if (!summary) {
			return res.status(404).json({ message: "Summary not found" });
		}

		res.json(createResponse(200, summarySerializer(summary)));
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

const update = async (req: Request, res: Response): Promise<any> => {
	try {
		const { id } = req.params;
		const { completedTodos, createdTodos } = req.body;

		const summary = await Summary.findByPk(decodeHashId(id));

		if (!summary) {
			return res.status(404).json({ message: "Summary not found" });
		}

		await summary.update({ completedTodos, createdTodos });

		res.json(createResponse(200, summarySerializer(summary)));
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

const exists = async (req: Request, res: Response): Promise<any> => {
	try {
		const { projectId } = req.query;

		if (!projectId) {
			return res.status(400).json({ error: "projectId is required" });
		}

		const decodedProjectId = decodeHashId(projectId as string);
		const startOfDay = dayjs().startOf("day").toDate();
		const endOfDay = dayjs().endOf("day").toDate();

		const todaySummary = await Summary.findOne({
			where: { projectId: decodedProjectId, createdAt: { [Op.between]: [startOfDay, endOfDay] } },
			attributes: ["id"],
		});

		return res.json({ exists: !!todaySummary });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

export const summaryController = { list, createOrUpdate, remove, show, update, exists };
