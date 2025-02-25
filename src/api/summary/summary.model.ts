import { DataTypes, InferAttributes, Model } from "sequelize";
import { encodeHashId } from "../helpers/hashid";
import sequelize from "../../config/database";
import Todo from "../todo/todo.model";

class Summary extends Model<InferAttributes<Summary, { omit: "projectHashId" | "hashId" }>, InferAttributes<Summary, { omit: "id" | "hashId" | "projectHashId" | "updatedAt" }>> {
	declare id: string;
	declare createdAt: Date;
	declare updatedAt: Date;
	declare projectId: string;
	declare createdTodos: Todo[];
	declare completedTodos: Todo[];

	get projectHashId(): string {
		return encodeHashId(this.projectId);
	}

	get hashId(): string {
		return encodeHashId(this.id);
	}
}

Summary.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},

		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},

		createdTodos: {
			type: DataTypes.JSONB,
			allowNull: true,
		},
		completedTodos: {
			type: DataTypes.JSONB,
			allowNull: true,
		},
		projectId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		tableName: "summaries",
		timestamps: true,
		sequelize,
		indexes: [
			{
				unique: true,
				fields: ["projectId", "createdAt"],
			},
		],
	}
);

export default Summary;
