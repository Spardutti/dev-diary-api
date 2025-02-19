import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../../config/database";
import { encodeHashId } from "../helpers/hashid";

class Note extends Model<InferAttributes<Note, { omit: "projectHashId" | "hashId" }>, InferCreationAttributes<Note, { omit: "id" | "projectHashId" | "hashId" }>> {
	declare id: string;
	declare title: string;
	declare content: string;
	declare projectId: string;
	declare readonly createdAt: Date;

	get projectHashId(): string {
		return encodeHashId(this.projectId);
	}

	get hashId(): string {
		return encodeHashId(this.id);
	}
}

Note.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: () => uuidv4(),
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		projectId: {
			type: DataTypes.UUID,
			allowNull: false,
		},

		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
	},
	{
		sequelize,
		tableName: "notes",
		timestamps: true,
	}
);

export default Note;
