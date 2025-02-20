import { createResponse } from "../helpers/responseHelper";
import Todo from "./todo.model";
import { Request, Response } from "express";
import { todoSerializer } from "./todo.serializer";
import { decodeHashId } from "../helpers/hashid";

const create = async (req: Request, res: Response): Promise<any> => {
	try {
		const { description, title, projectId, priority } = req.body;

		const todo = await Todo.create({ description, title, projectId: decodeHashId(projectId), status: false, priority });

		res.status(201).json(createResponse(201, todoSerializer(todo)));
	} catch (error) {
		res.status(500).json({ message: "Failed to create todo", error });
	}
};

const list = async (req: Request, res: Response): Promise<any> => {
	try {
		const { orderBy, orderDirection, ...filters } = req.query;

		const order: [string, string][] = [];

		if (orderBy) {
			// Split fields and directions
			const orderByFields = typeof orderBy === "string" ? orderBy.split(",") : [];
			const orderDirections = typeof orderDirection === "string" ? orderDirection.split(",") : [];

			orderByFields.forEach((field, index) => {
				const direction = orderDirections[index]?.toLowerCase() === "asc" ? "ASC" : "DESC";
				order.push([field.trim(), direction]);
			});
		}

		const projectId = filters?.projectId ? decodeHashId(filters.projectId as string) : undefined;

		const todos = await Todo.findAll({
			where: { ...filters, projectId },
			order,
		});

		return res.status(200).json(createResponse(200, todoSerializer(todos)));
	} catch (error) {
		return res.status(500).json({ error: "Failed to filter todos" });
	}
};

const update = async (req: Request, res: Response): Promise<any> => {
	try {
		const { id } = req.params;
		const { status, description, title, priority } = req.body;

		const todo = await Todo.findByPk(decodeHashId(id));

		if (!todo) {
			return res.status(404).json({ error: "Todo not found" });
		}
		const completedAt = status ? new Date() : null;

		await todo.update({ status, description, title, priority, completedAt });

		res.status(200).json(createResponse(200, todoSerializer(todo)));
	} catch (error) {
		res.status(500).json({ error: "Failed to update todo" });
	}
};

const remove = async (req: Request, res: Response): Promise<any> => {
	try {
		const { id } = req.params;

		const todo = await Todo.findByPk(decodeHashId(id));

		if (!todo) {
			return res.status(404).json({ error: "Todo not found" });
		}

		await todo.destroy();

		res.status(200).json(createResponse(200));
	} catch (error) {
		res.status(500).json({ error: "Failed to delete todo" });
	}
};

export const todoController = {
	create,
	list,
	update,
	remove,
};
