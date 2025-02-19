import Project from "../project/project.model";
import User from "../user/user.model";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import Note from "../note/note.model";
import { Op } from "sequelize";
import { decodeHashId } from "../helpers/hashid";

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

export const findOrCreateTodayNote = async (user: User) => {
	const project = await Project.findByPk(user.lastVisitedProjectId);

	if (!project) {
		return;
	}

	const todayNote = await Note.findOne({
		where: {
			projectId: project.id,
			createdAt: {
				[Op.between]: [dayjs().startOf("day").toDate(), dayjs().endOf("day").toDate()],
			},
		},
	});

	if (!todayNote) {
		const selectedDate = dayjs();
		const day = selectedDate.format("ddd");
		const numericDate = selectedDate.date();
		const monthAndYear = selectedDate.format("MMM YYYY");

		const title = `Notes Of ${day} ${numericDate}, ${monthAndYear}`;

		return await Note.create({
			title,
			content: "",
			projectId: project.id,
			createdAt: dayjs().toDate(),
		});
	}

	return todayNote;
};
