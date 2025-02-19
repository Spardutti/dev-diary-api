import Note from "./note.model";
export const noteSerializer = (input: Note | Note[]): Partial<Note> | Partial<Note>[] => {
	const serialize = (note: Note): Partial<Note> => ({
		id: note.hashId,
		title: note.title,
		projectId: note.projectHashId,
		content: note.content,
		createdAt: note.createdAt,
	});

	return Array.isArray(input) ? input.map(serialize) : serialize(input);
};
