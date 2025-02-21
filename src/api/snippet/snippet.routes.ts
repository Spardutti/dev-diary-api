import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { validateRequestBody } from "../middleware/validateRequestBody";
import { createSnippetSchema } from "./snippet.schema";
import { snippetController } from "./snippet.controller";

const routes = Router();

routes.post("/create", authMiddleware, validateRequestBody(createSnippetSchema), snippetController.create);
routes.get("/list", authMiddleware, snippetController.list);
routes.get("/show/:id", authMiddleware, snippetController.show);
routes.delete("/delete/:id", authMiddleware, snippetController.remove);
routes.put("/update/:id", authMiddleware, snippetController.update);

export default routes;
