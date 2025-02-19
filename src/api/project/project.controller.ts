import { decodeHashId } from "./../helpers/hashid";
import { createResponse } from "../helpers/responseHelper";
import Project from "../project/project.model";
import { findOrCreateTodayNote } from "../user/user.helpers";
import User from "../user/user.model";
import { Request, Response } from "express";
import { projectSerializer } from "../project/project.serializer";

const create = async (req: Request, res: Response): Promise<any> => {
	try {
		const { name, description } = req.body;
		const user = req.user! as User;

		const project = await Project.create({ name, description, userId: user.id });
		await findOrCreateTodayNote(user);
		await user.update({ lastVisitedProjectId: project.id });
		res.status(200).json(createResponse(201, projectSerializer(project)));
	} catch (error) {
		res.status(500).json({ error: "Failed to create project" });
	}
};

const list = async (req: Request, res: Response): Promise<any> => {
	try {
		const user = req.user! as User;
		const projects = await Project.findAll({ where: { userId: user.id } });
		res.status(200).json(createResponse(200, projectSerializer(projects)));
	} catch (error) {
		res.status(500).json({ error: "Failed to list projects" });
	}
};

const show = async (req: Request, res: Response): Promise<any> => {
	try {
		const user = req.user! as User;
		const project = await Project.findOne({ where: { id: decodeHashId(req.params.id), userId: user.id } });
		if (!project) {
			return res.status(404).json({ error: "Project not found" });
		}

		await user.update({ lastVisitedProjectId: project.id });
		const note = await findOrCreateTodayNote(user);

		// create method hashId on note and use it here to return the hash
		res.status(200).json(createResponse(200, { project: projectSerializer(project), todayNoteId: note?.hashId }));
	} catch (error) {
		res.status(500).json({ error: "Failed to show project" });
	}
};

const update = async (req: Request, res: Response): Promise<any> => {
	try {
		const user = req.user! as User;
		const { id } = req.params;

		const project = await Project.findOne({ where: { id: decodeHashId(id), userId: user.id } });

		if (!project) {
			return res.status(404).json({ error: "Project not found" });
		}
		const { name, description } = req.body;

		await project.update({ name, description });
		res.status(200).json(createResponse(200, projectSerializer(project)));
	} catch (error) {
		res.status(500).json({ error: "Failed to update project" });
	}
};

const remove = async (req: Request, res: Response): Promise<any> => {
	try {
		const { id } = req.params;
		const user = req.user as User;

		const userProjects = await Project.findAll({ where: { userId: user.id } });

		console.log("userProjects:", userProjects);
		if (userProjects.length <= 1) {
			return res.status(400).json({ error: "Cannot delete the only remaining project" });
		}

		const projectIndex = userProjects.findIndex((p) => p.hashId === id);
		if (projectIndex === -1) {
			return res.status(404).json({ error: "Project not found" });
		}

		const [deletedProject] = userProjects.splice(projectIndex, 1);

		await deletedProject.destroy();

		const redirectToProject = userProjects[0] || null;

		return res.status(200).json(createResponse(200, projectSerializer(redirectToProject)));
	} catch (error) {
		console.error("Error deleting project:", error);
		return res.status(500).json({ error: "Failed to delete project" });
	}
};

export const projectController = { create, list, show, update, remove };
