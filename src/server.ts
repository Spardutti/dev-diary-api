import "dotenv/config";
import express from "express";
import sequelize from "./config/database";
import routes from "./api/routes";
import passport from "./config/passportConfig";
import cors from "cors";
import { setupAssociations } from "./api/associations";
import cookieParser from "cookie-parser";
import { NotesCleaner } from "./cron/notesCleaner";

const app = express();
const PORT = process.env.PORT || 3000;

const apiUrl = "/api/v1";

app.use(express.json());
app.use(passport.initialize());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());

Object.entries(routes).forEach(([path, route]) => {
    app.use(`${apiUrl}/${path}`, route);
});

setupAssociations();

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully.");

        await sequelize.getQueryInterface().showAllTables();
        console.log("✅ Models synced with database.");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            NotesCleaner.start();
        });
    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
};

startServer();
