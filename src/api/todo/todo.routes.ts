import authMiddleware from "../middleware/authMiddleware";
import paginationMiddleware from "../middleware/paginationMiddleware ";
import { validateRequestBody } from "../middleware/validateRequestBody";
import { todoController } from "./todo.controller";
import Todo from "./todo.model";
import { createTodoSchema } from "./todo.schema";
import { Router } from "express";

const routes = Router();

routes.post("/create", authMiddleware, validateRequestBody(createTodoSchema), todoController.create);
routes.get("/list", authMiddleware, paginationMiddleware(Todo), todoController.list);
routes.put("/update/:id", authMiddleware, todoController.update);
routes.delete("/delete/:id", authMiddleware, todoController.remove);

export default routes;
