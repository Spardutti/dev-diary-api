import User from "./user.model";
import { serializeUser } from "./user.serializer";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createResponse } from "../helpers/responseHelper";
import { faker } from "@faker-js/faker";
import { createDefaultProject, createGuestUser, findOrCreateTodayNote, generateTokens } from "./user.helpers";

const create = async (req: Request, res: Response): Promise<any> => {
	try {
		const { name, email, password } = req.body;

		const hasPassword = await bcrypt.hash(password, 10);

		const existingEmail = await User.findOne({ where: { email } });

		if (existingEmail) {
			res.status(400).json({ error: "Email already exists" });
		}

		const user = await User.create({ name, email, password: hasPassword, isGuest: false, expiresAt: null });

		await createDefaultProject(user);

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

		const { refreshToken, refreshTokenMaxAge, token } = generateTokens(user.id);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV !== "development",
			maxAge: refreshTokenMaxAge,
			sameSite: "none",
		});

		await findOrCreateTodayNote(user);

		return res.json(createResponse(200, { token, user: serializeUser(user) }));
	} catch (error) {
		return res.status(500).json({ message: "Server error", error });
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

const refresh = async (req: Request, res: Response): Promise<any> => {
	try {
		const { refreshToken } = req.cookies;

		if (!refreshToken) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		try {
			const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { id: string };

			const user = await User.findByPk(decoded.id);

			if (!user) {
				return res.status(401).json({ error: "Unauthorized" });
			}

			const { token } = generateTokens(user.id);

			return res.json(createResponse(200, { token }));
		} catch (error) {
			// Client axios wont catch 401 as error so we throw 404.
			res.status(404).json({ error: "Unauthorized" });
		}
	} catch (error) {
		return res.status(500).json({ error: "Server error" });
	}
};

const logout = async (req: Request, res: Response): Promise<any> => {
	try {
		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});

		res.json({ message: "Logged out successfully" });
	} catch (error) {
		return res.status(500).json({ error: "Server error" });
	}
};

export const userController = { create, login, me, refresh, logout };
