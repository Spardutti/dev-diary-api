import User from "@/api/user/user.model";
import Project from "@/api/project/project.model";
import Todo from "@/api/todo/todo.model";
import Note from "@/api/note/note.model";

export const setupAssociations = () => {
	// User - Project
	User.hasMany(Project, { foreignKey: "userId", as: "projects" });
	Project.belongsTo(User, { foreignKey: "userId", as: "user" });

	// Project - Todo
	Project.hasMany(Todo, { foreignKey: "projectId", as: "todos" });
	Todo.belongsTo(Project, { foreignKey: "projectId", as: "project" });

	// Project - Note
	Project.hasMany(Note, { foreignKey: "projectId", as: "notes" });
	Note.belongsTo(Project, { foreignKey: "projectId", as: "project" });
};
