import { Router } from "express";
import { githubController } from "./github.controller";

const routes = Router();

routes.get("/commits", githubController.getRepoCommits);

export default routes;
