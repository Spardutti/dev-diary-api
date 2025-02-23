import authMiddleware from "../middleware/authMiddleware";
import { validateRequestBody } from "../middleware/validateRequestBody";
import { userController } from "./user.controller";
import { createUserSchema, loginUserSchema } from "./user.schema";
import { Router } from "express";

const routes = Router();

routes.post("/create", validateRequestBody(createUserSchema), userController.create);
routes.post("/login", validateRequestBody(loginUserSchema), userController.login);
routes.get("/me", authMiddleware, userController.me);
routes.post("/logout", authMiddleware, userController.logout);
routes.get("/refresh", userController.refresh);
routes.post("/guest", userController.guest);

export default routes;
