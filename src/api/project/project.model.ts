import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/config/database";
import { v4 as uuidv4 } from "uuid";
import User from "@/api/user/user.model";

interface ProjectAttributes {
	id: string;
	description: string;
	name: string;
	userId: string;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, "id"> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
	public id!: string;
	public description!: string;
	public name!: string;
	public userId!: string;
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
			allowNull: false,
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
		},
	},
	{
		sequelize,
		tableName: "projects",
		timestamps: true,
	}
);

export default Project;
