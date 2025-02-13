import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequestBody = <T extends ZodSchema>(schema: T) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const validationResult = schema.safeParse(req.body);

		if (!validationResult.success) {
			res.status(400).json({
				error: "Validation failed",
				details: validationResult.error.errors.map((err) => ({
					field: err.path.length > 0 ? err.path.join(".") : "body",
					message: err.message,
				})),
			});
			return;
		}

		next();
	};
};
