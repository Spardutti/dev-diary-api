import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { summaryController } from "./summary.controller";
import { validateRequestBody } from "../middleware/validateRequestBody";
import { createSummarySchema } from "./summary.schema";

const routes = Router();

routes.get("/list", authMiddleware, summaryController.list);
routes.post("/create", validateRequestBody(createSummarySchema), authMiddleware, summaryController.create);

export default routes;
