import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "@/config/database";

export interface TodoAttributes {
	id: string;
	title: string;
	description: string;
	projectId: string;
	status: boolean;
}

interface TodoCreationAttributes extends Optional<TodoAttributes, "id"> {}

class Todo extends Model<TodoAttributes, TodoCreationAttributes> implements TodoAttributes {
	public id!: string;
	public title!: string;
	public description!: string;
	public projectId!: string;
	public status!: boolean;
}

Todo.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: uuidv4,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		projectId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		status: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		sequelize,
		tableName: "todos",
		timestamps: true,
	}
);

export default Todo;
