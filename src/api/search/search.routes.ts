import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { searchController } from "./search.controller";

const routes = Router();

routes.get("/:model", authMiddleware, searchController.search);

export default routes;
