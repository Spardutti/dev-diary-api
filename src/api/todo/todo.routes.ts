import authMiddleware from "../middleware/authMiddleware";
import { validateRequestBody } from "../middleware/validateRequestBody";
import { todoController } from "./todo.controller";
import { createTodoSchema } from "./todo.schema";
import { Router } from "express";

const routes = Router();

routes.post("/create", authMiddleware, validateRequestBody(createTodoSchema), todoController.create);
routes.get("/list", authMiddleware, todoController.list);
routes.put("/update/:id", authMiddleware, todoController.update);
routes.delete("/delete/:id", authMiddleware, todoController.remove);

export default routes;
