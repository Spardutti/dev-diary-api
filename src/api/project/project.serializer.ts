import Project from "./project.model";

export const projectSerializer = (input: Project | Project[]): Partial<Project> | Partial<Project>[] => {
	const serialize = (project: Project): Partial<Project> => ({
		id: project.hashId,
		name: project.name,
		description: project.description,
		userId: project.userHashId,
	});

	return Array.isArray(input) ? input.map(serialize) : serialize(input);
};
