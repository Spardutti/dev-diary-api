import authMiddleware from "@/api/middleware/authMiddleware";
import { validateRequestBody } from "@/api/middleware/validateRequestBody";
import { projectController } from "@/api/project/project.controller";
import { createProjectSchema } from "@/api/project/project.schema";
import { Router } from "express";

const routes = Router();

routes.post("/create", authMiddleware, validateRequestBody(createProjectSchema), projectController.create);
routes.get("/list", authMiddleware, projectController.list);
routes.get("/show/:id", authMiddleware, projectController.show);

export default routes;
