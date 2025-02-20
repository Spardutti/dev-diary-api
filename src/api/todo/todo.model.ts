import { DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../../config/database";
import { encodeHashId } from "../helpers/hashid";

export enum TodoPriority {
	Default = 0,
	Low = 1,
	Medium = 2,
	High = 3,
}

class Todo extends Model<InferAttributes<Todo, { omit: "projectHashId" | "createdAt" | "updatedAt" | "hashId" }>, InferCreationAttributes<Todo, { omit: "id" | "projectHashId" | "createdAt" | "updatedAt" | "hashId" }>> {
	declare id: string;
	declare title: string;
	declare description: string;
	declare projectId: string;
	declare status: boolean;
	declare priority: number;
	declare completedAt: Date | null;

	get projectHashId(): string {
		return encodeHashId(this.projectId);
	}

	get createdAt(): string {
		return this.createdAt;
	}
	get updatedAt(): string {
		return this.updatedAt;
	}

	get hashId(): string {
		return encodeHashId(this.id);
	}
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
		priority: {
			type: DataTypes.INTEGER,
			defaultValue: TodoPriority.Default,
			validate: {
				isIn: [[0, 1, 2, 3]],
			},
		},
		completedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		sequelize,
		tableName: "todos",
		timestamps: true,
	}
);

export default Todo;
