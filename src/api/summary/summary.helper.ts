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

	const completedTodos = todos.filter((todo) => todo.completedAt && dayjs(todo.completedAt).isSame(parsedDate, "day"));

	const createdTodos = todos.filter(
		(todo) => todo.createdAt && dayjs(todo.createdAt).isSame(parsedDate, "day") && !completedTodos.some((completed) => completed.id === todo.id) // Exclude if also completed
	);

	return { note, createdTodos, completedTodos };
};
