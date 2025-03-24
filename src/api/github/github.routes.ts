import { Router } from "express";
import { githubController } from "./github.controller";
import authMiddleware from "../middleware/authMiddleware";
import { validateRequestBody } from "../middleware/validateRequestBody";
import { createGithubConfigSchema } from "./github.schema";

const routes = Router();

routes.post("/create", authMiddleware, validateRequestBody(createGithubConfigSchema), githubController.create);
routes.get("/list", authMiddleware, githubController.list);
routes.put("/update/:id", authMiddleware, githubController.update);
routes.delete("/delete/:id", authMiddleware, githubController.remove);

export default routes;
