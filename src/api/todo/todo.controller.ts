import { createResponse } from "@/api/helpers/responseHelper";
import Todo from "@/api/todo/todo.model";
import { Request, Response } from "express";

const create = async (req: Request, res: Response): Promise<any> => {
	try {
		const { description, title, projectId } = req.body;

		const todo = await Todo.create({ description, title, projectId, status: false });

		res.status(201).json(createResponse(201, todo));
	} catch (error) {
		res.status(500).json({ error: "Failed to create todo" });
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

		const todos = await Todo.findAll({
			where: filters,
			order,
		});

		return res.status(200).json(createResponse(200, todos));
	} catch (error) {
		return res.status(500).json({ error: "Failed to filter todos" });
	}
};

const update = async (req: Request, res: Response): Promise<any> => {
	try {
		const { id } = req.params;
		const updateData: Partial<Todo> = req.body;

		const todo = await Todo.findByPk(id);

		if (!todo) {
			return res.status(404).json({ error: "Todo not found" });
		}

		await todo.update(updateData);

		res.status(200).json(createResponse(200, todo));
	} catch (error) {
		res.status(500).json({ error: "Failed to update todo" });
	}
};

export const todoController = {
	create,
	list,
	update,
};
