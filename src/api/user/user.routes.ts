import authMiddleware from "@/api/middleware/authMiddleware";
import { validateRequestBody } from "@/api/middleware/validateRequestBody";
import { userController } from "@/api/user/user.controller";
import { createUserSchema, loginUserSchema } from "@/api/user/user.schema";
import { Router } from "express";

const routes = Router();

routes.post("/create", validateRequestBody(createUserSchema), userController.create);
routes.post("/login", validateRequestBody(loginUserSchema), userController.login);
routes.get("/me", authMiddleware, userController.me);

export default routes;
