import Todo from "../todo/todo.model";
import { todoSerializer } from "./../todo/todo.serializer";
import Summary from "./summary.model";

export const summarySerializer = (input: Summary | Summary[]): Partial<Summary> | Partial<Summary>[] => {
	const serialize = (summary: Summary): Partial<Summary> => ({
		id: summary.hashId,
		completedTodos: todoSerializer(summary.completedTodos) as Todo[],
		createdTodos: todoSerializer(summary.createdTodos) as Todo[],
		projectId: summary.projectHashId,
		createdAt: summary.createdAt,
		updatedAt: summary.updatedAt,
	});

	return Array.isArray(input) ? input.map(serialize) : serialize(input);
};
