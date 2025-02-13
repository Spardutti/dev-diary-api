import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
	database: process.env.DB_NAME || "dev_db",
	username: process.env.DB_USER || "postgres",
	password: process.env.DB_PASS || "password",
	host: process.env.DB_HOST || "localhost",
	port: Number(process.env.DB_PORT) || 5432,
	dialect: "postgres",
	logging: false,
});

export default sequelize;
