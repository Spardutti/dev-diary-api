import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { summaryController } from "./summary.controller";
import { validateRequestBody } from "../middleware/validateRequestBody";
import { createSummarySchema } from "./summary.schema";

const routes = Router();

routes.get("/list", authMiddleware, summaryController.list);
routes.post("/create", validateRequestBody(createSummarySchema), authMiddleware, summaryController.create);
routes.delete("/delete/:id", authMiddleware, summaryController.remove);
routes.get("/show/:id", authMiddleware, summaryController.show);
routes.put("/update/:id", authMiddleware, summaryController.update);
routes.get("/exists", authMiddleware, summaryController.exists);

export default routes;
