import { Router } from "express";
import { healthController } from "./health.controller";

const routes = Router();

routes.get("/", healthController.health);

export default routes;
