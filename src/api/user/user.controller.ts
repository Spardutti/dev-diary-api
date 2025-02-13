import User from "@/api/user/user.model";
import { serializeUser } from "@/api/user/user.serializer";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createResponse } from "@/api/helpers/responseHelper";
import Project from "@/api/project/project.model";

const create = async (req: Request, res: Response): Promise<any> => {
	try {
		const { name, email, password } = req.body;

		const hasPassword = await bcrypt.hash(password, 10);

		const existingEmail = await User.findOne({ where: { email } });

		if (existingEmail) {
			res.status(400).json({ error: "Email already exists" });
		}

		const user = await User.create({ name, email, password: hasPassword });

		const project = await Project.create({ name: "My first project", userId: user.id, description: "This is my first project" });

		await user.update({ lastVisitedProjectId: project.id });

		res.status(201).json(createResponse(201, serializeUser(user)));
	} catch (error) {
		res.status(500).json({ error: "Failed to create user" });
	}
};

const login = async (req: Request, res: Response): Promise<any> => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

		return res.json(createResponse(200, { token, user: serializeUser(user) }));
	} catch (error) {
		return res.status(500).json({ error: "Server error" });
	}
};

const me = async (req: Request, res: Response): Promise<any> => {
	try {
		if (req.user) {
			return res.json(createResponse(200, serializeUser(req.user as User)));
		}

		return res.status(401).json({ error: "Unauthorized" });
	} catch (error) {
		return res.status(500).json({ error: "Server error" });
	}
};

export const userController = { create, login, me };
