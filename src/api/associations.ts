import User from "./user/user.model";
import Project from "./project/project.model";
import Todo from "./todo/todo.model";
import Note from "./note/note.model";
import GithubConfig from "./github/github.model";

export const setupAssociations = () => {
	// User - Project
	User.hasMany(Project, { foreignKey: "userId", as: "projects", onDelete: "CASCADE" });
	Project.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });

	// Project - Todo
	Project.hasMany(Todo, { foreignKey: "projectId", as: "todos", onDelete: "CASCADE" });
	Todo.belongsTo(Project, { foreignKey: "projectId", as: "project", onDelete: "CASCADE" });

	// Project - Note
	Project.hasMany(Note, { foreignKey: "projectId", as: "notes", onDelete: "CASCADE" });
	Note.belongsTo(Project, { foreignKey: "projectId", as: "project", onDelete: "CASCADE" });

	// Project - Github-Config
	Project.hasOne(GithubConfig, { foreignKey: "projectId", as: "githubConfig", onDelete: "CASCADE" });
	GithubConfig.belongsTo(Project, { foreignKey: "projectId", as: "project", onDelete: "CASCADE" });
};
