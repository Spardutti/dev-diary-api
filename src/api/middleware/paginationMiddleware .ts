import { NextFunction, Request, Response } from "express";
import { Model, ModelStatic } from "sequelize";
import { parseQueryParams } from "../helpers/parseQueryParams";

// Extend the Express Request type to include pagination
declare global {
	namespace Express {
		interface Request {
			pagination?: {
				totalItems: number;
				totalPages: number;
				currentPage: number;
				itemsPerPage: number;
				skip: number;
				limit: number;
			};
		}
	}
}

// Pagination middleware for Sequelize models
export const paginationMiddleware = (model: ModelStatic<Model>) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Parse all query parameters
			const { filters, pagination } = parseQueryParams(req.query);
			const { page, limit, offset } = pagination;

			// Count with filters applied
			const totalItems = await model.count({ where: filters });

			// Set pagination info on request
			req.pagination = {
				totalItems,
				totalPages: Math.ceil(totalItems / limit),
				currentPage: page,
				itemsPerPage: limit,
				skip: offset,
				limit,
			};

			next();
		} catch (error) {
			next(error);
		}
	};
};

export default paginationMiddleware;
