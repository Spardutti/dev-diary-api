import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../config/database";
import { v4 as uuidv4 } from "uuid";
import { encodeHashId } from "../helpers/hashid";

class Project extends Model<InferAttributes<Project, { omit: "hashId" | "userHashId" }>, InferCreationAttributes<Project, { omit: "id" | "hashId" | "userHashId" }>> {
	declare id: string;
	declare description: string;
	declare name: string;
	declare userId: string;

	get hashId(): string {
		return encodeHashId(this.id);
	}

	get userHashId(): string {
		return encodeHashId(this.userId);
	}
}

Project.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: uuidv4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		sequelize,
		tableName: "projects",
		timestamps: true,
	}
);

export default Project;
