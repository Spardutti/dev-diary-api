import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { encodeHashId } from "../helpers/hashid";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../../config/database";

class Snippet extends Model<InferAttributes<Snippet, { omit: "hashId" | "userHashId" }>, InferCreationAttributes<Snippet, { omit: "id" | "hashId" | "userHashId" | "createdAt" | "updatedAt" }>> {
	declare id: string;
	declare title: string;
	declare description: string;
	declare code: string;
	declare createdAt: string;
	declare updatedAt: string;
	declare userId: string;
	declare language: string;

	get hashId(): string {
		return encodeHashId(this.id);
	}

	get userHashId(): string {
		return encodeHashId(this.userId);
	}
}

Snippet.init(
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
		code: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			onDelete: "CASCADE",
			references: {
				model: "users",
				key: "id",
			},
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		language: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "snippets",
		timestamps: true,
	}
);

export default Snippet;
