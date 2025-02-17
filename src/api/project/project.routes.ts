import authMiddleware from "../middleware/authMiddleware";
import { validateRequestBody } from "../middleware/validateRequestBody";
import { projectController } from "../project/project.controller";
import { createProjectSchema } from "../project/project.schema";
import { Router } from "express";

const routes = Router();

routes.post("/create", authMiddleware, validateRequestBody(createProjectSchema), projectController.create);
routes.get("/list", authMiddleware, projectController.list);
routes.get("/show/:id", authMiddleware, projectController.show);
routes.put("/update/:id", authMiddleware, validateRequestBody(createProjectSchema), projectController.update);

export default routes;
