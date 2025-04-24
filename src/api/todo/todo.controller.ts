import { createResponse } from "../helpers/responseHelper";
import Todo from "./todo.model";
import { Request, Response } from "express";
import { todoSerializer } from "./todo.serializer";
import { decodeHashId } from "../helpers/hashid";
import { parseQueryParams } from "../helpers/parseQueryParams";

const create = async (req: Request, res: Response): Promise<any> => {
    try {
        const { description, title, projectId, priority, status, createdAt: created, completedAt: completed } = req.body;
        const { createdAt, completedAt } = getDates({ created, completed });
        const todo = await Todo.create({ description, title, projectId: decodeHashId(projectId), status, priority, createdAt, completedAt });

        res.status(201).json(createResponse(201, todoSerializer(todo)));
    } catch (error) {
        res.status(500).json({ message: "Failed to create todo", error });
    }
};

const list = async (req: Request, res: Response): Promise<any> => {
    try {
        const { filters, order } = parseQueryParams(req.query);

        const { pagination } = req;

        const todos = await Todo.findAll({
            where: filters,
            order,
            limit: pagination?.limit,
            offset: pagination?.skip,
        });

        return res.status(200).json(createResponse(200, todoSerializer(todos), pagination));
    } catch (error) {
        return res.status(500).json({ error: "Failed to filter todos" });
    }
};

const update = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { status, description, title, priority, createdAt: created, completedAt: completed } = req.body;
        const { createdAt, completedAt } = getDates({ created, completed });

        const todo = await Todo.findByPk(decodeHashId(id));

        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        await todo.update({ status, description, title, priority, createdAt, completedAt });

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

const getDates = ({ created, completed }: { created: string; completed: string }): { createdAt: Date; completedAt: Date | null } => {
    return {
        createdAt: created ? new Date(created) : new Date(),
        completedAt: completed ? new Date(completed) : null,
    };
};

export const todoController = {
    create,
    list,
    update,
    remove,
};
