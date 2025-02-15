import User from "@/api/user/user.model";
import { serializeUser } from "@/api/user/user.serializer";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createResponse } from "@/api/helpers/responseHelper";
import Project from "@/api/project/project.model";
import { faker } from "@faker-js/faker";
import { createDefaultProject, createGuestUser, generateTokens } from "@/api/user/user.helpers";

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
			secure: process.env.NODE_ENV === "production", // Ensures secure cookies in production
			sameSite: "strict",
			maxAge: refreshTokenMaxAge,
		});

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

const refresh = async (req: Request, res: Response): Promise<any> => {
	try {
		const { refreshToken } = req.cookies;

		if (!refreshToken) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { id: string };

		const user = await User.findByPk(decoded.id);

		if (!user) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const { token } = generateTokens(user.id);

		return res.json(createResponse(200, { token }));
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

const guestLogin = async (req: Request, res: Response): Promise<any> => {
	try {
		const guest = await createGuestUser();

		await createDefaultProject(guest, faker.commerce.productName(), faker.commerce.productDescription());

		const { refreshToken, refreshTokenMaxAge, token } = generateTokens(guest.id);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: refreshTokenMaxAge,
		});

		res.json(
			createResponse(200, {
				token,
				user: {
					id: guest.id,
					name: guest.name,
					email: guest.email,
					lastVisitedProjectId: guest.lastVisitedProjectId,
					isGuest: true,
				},
			})
		);
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
};

export const userController = { create, login, me, refresh, logout, guestLogin };
