import { Request, Response } from "express";

export const health = async (req: Request, res: Response): Promise<any> => {
	res.status(200).json({ message: "Server is running" });
};

export const healthController = {
	health,
};
