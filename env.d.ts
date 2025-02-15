/// <reference types="node" />

declare namespace NodeJS {
	export interface ProcessEnv {
		NODE_ENV: "development" | "production" | "test";
		JWT_SECRET: string;
		JWT_REFRESH_SECRET: string;
		DB_NAME: string;
		DB_USER: string;
		DB_PASS: string;
		DB_HOST: string;
		DB_PORT: number;
		FRONTEND_URL: string;
		DATABASE_URL: string;
	}
}
