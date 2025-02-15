import Project from "../project/project.model";
import User from "../user/user.model";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";

const accessTokenExpiry = "1d";
const refreshTokenExpiry = "7d";
const refreshTokenMaxAge = parseInt(refreshTokenExpiry) * 24 * 60 * 60 * 1000;

export const createGuestUser = async (): Promise<User> => {
	const expiresAt = dayjs().add(1, "day").toDate();
	const hashedPassword = await bcrypt.hash(faker.internet.password(), 10);

	return await User.create({
		name: faker.person.firstName(),
		email: faker.internet.email(),
		password: hashedPassword,
		isGuest: true,
		expiresAt,
	});
};

export const generateTokens = (userId: string) => {
	const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: accessTokenExpiry });
	const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: refreshTokenExpiry });

	return { token, refreshToken, refreshTokenMaxAge };
};

export const createDefaultProject = async (user: User, name = "My First Project", description = "This is my first project") => {
	const project = await Project.create({ name, userId: user.id, description });

	await user.update({ lastVisitedProjectId: project.id });
};
