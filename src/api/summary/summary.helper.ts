import dayjs, { Dayjs } from "dayjs";
import Note from "../note/note.model";
import Todo from "../todo/todo.model";
import { Op } from "sequelize";

export const getSummaryForDate = async (date: Dayjs): Promise<{ note: Note | null; createdTodos: Todo[]; completedTodos: Todo[] }> => {
	const startOfDay = date.startOf("day").toDate();
	const endOfDay = date.endOf("day").toDate();
	const parsedDate = dayjs(date);

	const note = await Note.findOne({
		where: {
			createdAt: { [Op.between]: [startOfDay, endOfDay] },
		},
	});

	const todos = await Todo.findAll({
		where: {
			[Op.or]: {
				completedAt: { [Op.between]: [startOfDay, endOfDay] },
				createdAt: { [Op.between]: [startOfDay, endOfDay] },
			},
		},
	});

	const formattedTodos = {
		created: todos.filter((todo) => todo.createdAt && dayjs(todo.createdAt).isSame(parsedDate, "day")),
		completed: todos.filter((todo) => todo.completedAt && dayjs(todo.completedAt).isSame(parsedDate, "day")),
	};

	return { note, createdTodos: formattedTodos.created, completedTodos: formattedTodos.completed };
};
