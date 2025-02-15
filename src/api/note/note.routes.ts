import authMiddleware from "../middleware/authMiddleware";
import { validateRequestBody } from "../middleware/validateRequestBody";
import { notesController } from "../note/note.controller";
import { createNoteSchema, updateNoteSchema } from "../note/notes.schema";
import { Router } from "express";

const routes = Router();

routes.post("/create", authMiddleware, validateRequestBody(createNoteSchema), notesController.create);
routes.get("/show/:date/:projectId", authMiddleware, notesController.show);
routes.get("/list", authMiddleware, notesController.list);
routes.put("/update/:id", authMiddleware, validateRequestBody(updateNoteSchema), notesController.update);

export default routes;
