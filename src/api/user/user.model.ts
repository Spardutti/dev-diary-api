import { DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { v4 as uuidv4 } from "uuid";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User, { omit: "id" | "lastVisitedProjectId" }>> {
	declare id: string;
	declare name: string;
	declare email: string;
	declare password: string;
	declare lastVisitedProjectId: string;
	declare isGuest: boolean;
	declare expiresAt: Date | null;
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

		isGuest: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},

		expiresAt: {
			type: DataTypes.DATE,
			defaultValue: null,
			allowNull: true,
		},
	},
	{
		sequelize,
		tableName: "users",
		timestamps: true,
	}
);

export default User;
