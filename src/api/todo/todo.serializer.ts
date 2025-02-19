import Todo from "./todo.model";

export const todoSerializer = (input: Todo | Todo[]): Partial<Todo> | Partial<Todo>[] => {
	const serialize = (todo: Todo): Partial<Todo> => ({
		id: todo.hashId,
		title: todo.title,
		description: todo.description,
		status: todo.status,
		projectId: todo.projectHashId,
		createdAt: todo.createdAt,
		updatedAt: todo.updatedAt,
	});

	return Array.isArray(input) ? input.map(serialize) : serialize(input);
};
