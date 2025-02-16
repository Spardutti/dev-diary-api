import { Sequelize } from "sequelize";

const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is required in production mode.");
}

// Ensure all required environment variables are defined
const requiredEnvVars = ["DB_NAME", "DB_USER", "DB_PASS", "DB_HOST", "DB_PORT"];
requiredEnvVars.forEach((envVar) => {
	if (!process.env[envVar]) {
		throw new Error(`Missing environment variable: ${envVar}`);
	}
});

const sequelize = isProduction
	? new Sequelize(process.env.DATABASE_URL as string, {
			dialect: "postgres",
			logging: false,
	  })
	: new Sequelize({
			database: process.env.DB_NAME!,
			username: process.env.DB_USER!,
			password: process.env.DB_PASS!,
			host: process.env.DB_HOST!,
			port: Number(process.env.DB_PORT),
			dialect: "postgres",
			logging: false,
	  });

export default sequelize;
