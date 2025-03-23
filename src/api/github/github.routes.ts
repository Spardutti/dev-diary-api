import { Router } from "express";
import { githubController } from "./github.controller";
import authMiddleware from "../middleware/authMiddleware";
import { validateRequestBody } from "../middleware/validateRequestBody";
import { createGithubConfigSchema } from "./github.schema";

const routes = Router();

routes.post("/create", authMiddleware, validateRequestBody(createGithubConfigSchema), githubController.create);

export default routes;
