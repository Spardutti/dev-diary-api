import { createResponse } from "../helpers/responseHelper";
import Project from "../project/project.model";
import User from "../user/user.model";
import { Request, Response } from "express";

const create = async (req: Request, res: Response): Promise<any> => {
	try {
		const { name, description } = req.body;
		const user = req.user! as User;

		const project = await Project.create({ name, description, userId: user.id });
		res.status(200).json(createResponse(201, project));
	} catch (error) {
		res.status(500).json({ error: "Failed to create project" });
	}
};

const list = async (req: Request, res: Response): Promise<any> => {
	try {
		const user = req.user! as User;
		const projects = await Project.findAll({ where: { userId: user.id } });
		res.status(200).json(createResponse(200, projects));
	} catch (error) {
		res.status(500).json({ error: "Failed to list projects" });
	}
};

const show = async (req: Request, res: Response): Promise<any> => {
	try {
		const user = req.user! as User;
		const project = await Project.findOne({ where: { id: req.params.id, userId: user.id } });
		if (!project) {
			return res.status(404).json({ error: "Project not found" });
		}
		res.status(200).json(createResponse(200, project));
	} catch (error) {
		res.status(500).json({ error: "Failed to show project" });
	}
};

const update = async (req: Request, res: Response): Promise<any> => {
	try {
		const user = req.user! as User;

		const project = await Project.findOne({ where: { id: req.params.id, userId: user.id } });

		if (!project) {
			return res.status(404).json({ error: "Project not found" });
		}
		const { name, description } = req.body;

		await project.update({ name, description });
		res.status(200).json(createResponse(200, project));
	} catch (error) {
		res.status(500).json({ error: "Failed to update project" });
	}
};

export const projectController = { create, list, show, update };
