import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../../config/database";

interface NoteAttributes {
	id: string;
	title: string;
	content: string;
	projectId: string;
	createdAt: Date;
}

interface NoteCreationAttributes extends Optional<NoteAttributes, "id"> {}

class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
	public id!: string;
	public title!: string;
	public content!: string;
	public projectId!: string;
	public readonly createdAt!: Date;
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
