import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/config/database";
import { v4 as uuidv4 } from "uuid";

export interface UserAttributes {
	id: string;
	name: string;
	email: string;
	password: string;
	lastVisitedProjectId: string | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
	public id!: string;
	public name!: string;
	public email!: string;
	public password!: string;
	public lastVisitedProjectId!: string;
}

User.init(
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
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		lastVisitedProjectId: {
			type: DataTypes.UUID,
			allowNull: true,
			defaultValue: null,
		},
	},
	{
		sequelize,
		tableName: "users",
		timestamps: true,
	}
);

export default User;
