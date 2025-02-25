import dayjs, { Dayjs } from "dayjs";
import Todo from "../todo/todo.model";
import { Op } from "sequelize";
import { decodeHashId } from "../helpers/hashid";

export const getSummaryForDate = async (date: Dayjs, projectId: string): Promise<{ createdTodos: Todo[]; completedTodos: Todo[] }> => {
	const startOfDay = date.startOf("day").toDate();
	const endOfDay = date.endOf("day").toDate();
	const parsedDate = dayjs(date);

	const todos = await Todo.findAll({
		where: {
			[Op.or]: {
				completedAt: { [Op.between]: [startOfDay, endOfDay] },
				createdAt: { [Op.between]: [startOfDay, endOfDay] },
			},
			projectId: decodeHashId(projectId),
		},
	});

	const completedTodos = todos.filter((todo) => todo.completedAt && dayjs(todo.completedAt).isSame(parsedDate, "day"));

	const createdTodos = todos.filter(
		(todo) => todo.createdAt && dayjs(todo.createdAt).isSame(parsedDate, "day") && !completedTodos.some((completed) => completed.id === todo.id) // Exclude if also completed
	);

	return { createdTodos, completedTodos };
};
