import { createResponse } from "../helpers/responseHelper";
import Project from "../project/project.model";
import { findOrCreateTodayNote } from "../user/user.helpers";
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

		await user.update({ lastVisitedProjectId: project.id });
		const note = await findOrCreateTodayNote(user);

		res.status(200).json(createResponse(200, { project, todayNoteId: note?.id }));
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

import { Op } from "sequelize";

const remove = async (req: Request, res: Response): Promise<any> => {
	try {
		const { id } = req.params;
		const user = req.user as User;

		const userProjects = await Project.findAll({ where: { userId: user.id } });

		if (userProjects.length <= 1) {
			return res.status(400).json({ error: "Cannot delete the only remaining project" });
		}

		const projectIndex = userProjects.findIndex((p) => p.id === id);
		if (projectIndex === -1) {
			return res.status(404).json({ error: "Project not found" });
		}

		const [deletedProject] = userProjects.splice(projectIndex, 1);

		await deletedProject.destroy();

		const redirectToProject = userProjects[0] || null;

		return res.status(200).json(createResponse(200, { project: redirectToProject }));
	} catch (error) {
		console.error("Error deleting project:", error);
		return res.status(500).json({ error: "Failed to delete project" });
	}
};

export const projectController = { create, list, show, update, remove };
