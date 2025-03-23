import dayjs, { Dayjs } from "dayjs";
import Todo from "../todo/todo.model";
import { Op } from "sequelize";
import { decodeHashId } from "../helpers/hashid";
import { ICommit } from "../github/github.types";

export const getSummaryForDate = async (date: Dayjs, projectId: string, commits: ICommit[]): Promise<{ createdTodos: Todo[]; completedTodos: Todo[] }> => {
	const startOfDay = date.startOf("day").toDate();
	const endOfDay = date.endOf("day").toDate();
	const parsedDate = dayjs(date);

	const existingTodos = await Todo.findAll({
		where: {
			[Op.or]: {
				completedAt: { [Op.between]: [startOfDay, endOfDay] },
				createdAt: { [Op.between]: [startOfDay, endOfDay] },
			},
			projectId: decodeHashId(projectId),
		},
	});

	const existingTodoDescriptions = new Set(existingTodos.map((todo) => todo.title));

	const newCommitTodos = commits
		.filter((commit) => !existingTodoDescriptions.has(commit.message))
		.map((commit) => ({
			description: commit.message,
			projectId: decodeHashId(projectId),
			status: true,
			title: commit.message,
			priority: 0,
			completedAt: new Date(commit.date),
			createdAt: new Date(commit.date),
		}));

	let completedTodos = existingTodos.filter((todo) => todo.completedAt && dayjs(todo.completedAt).isSame(parsedDate, "day"));

	// Bulk create only if there are new commit todos
	if (newCommitTodos.length > 0) {
		const createdTodos = await Todo.bulkCreate(newCommitTodos);
		completedTodos = [...completedTodos, ...createdTodos];
	}

	const createdTodos = existingTodos.filter(
		(todo) => todo.createdAt && dayjs(todo.createdAt).isSame(parsedDate, "day") && !completedTodos.some((completed) => completed.id === todo.id) // Exclude if also completed
	);

	return { createdTodos, completedTodos };
};
