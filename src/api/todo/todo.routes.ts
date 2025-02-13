import authMiddleware from "@/api/middleware/authMiddleware";
import { validateRequestBody } from "@/api/middleware/validateRequestBody";
import { todoController } from "@/api/todo/todo.controller";
import { createTodoSchema } from "@/api/todo/todo.schema";
import { Router } from "express";

const routes = Router();

routes.post("/create", authMiddleware, validateRequestBody(createTodoSchema), todoController.create);
routes.get("/list", authMiddleware, todoController.list);
routes.put("/update/:id", authMiddleware, todoController.update);

export default routes;
