import { Op } from "sequelize";
import { decodeHashId } from "./hashid";
import dayjs from "dayjs";

const NON_FILTER_PARAMS = ["page", "limit", "orderBy", "orderDirection", "from", "to"];

interface Pagination {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	itemsPerPage: number;
	skip: number;
	limit: number;
}

declare global {
	namespace Express {
		interface Request {
			pagination?: Pagination;
		}
	}
}

export interface ParsedQuery {
	filters: Record<string, any>;
	order: [string, string][];
	pagination: {
		page: number;
		limit: number;
		offset: number;
	};
}

// Parse query parameters
export const parseQueryParams = (query: Record<string, any>): ParsedQuery => {
	const page = parseInt(query.page as string) || 1;
	const limit = parseInt(query.limit as string) || 10;
	const offset = (page - 1) * limit;

	// Extract order parameters
	const { orderBy, orderDirection } = query;
	const order: [string, string][] = [];

	if (orderBy) {
		const orderByFields = typeof orderBy === "string" ? orderBy.split(",") : [];
		const orderDirections = typeof orderDirection === "string" ? orderDirection.split(",") : [];

		//createadAt,completed&orderDirectioN=asc,desc

		orderByFields.forEach((field, index) => {
			const direction = orderDirections[index]?.toLowerCase() === "asc" ? "ASC" : "DESC";
			order.push([field.trim(), direction]);
		});
	} else {
		// Default order
		order.push(["createdAt", "DESC"]);
	}

	const filters: Record<string, any> = {};

	if (query.from && query.to) {
		const fromDate = dayjs(query.from).startOf("day").toDate();
		const toDate = dayjs(query.to).endOf("day").toDate();

		filters.createdAt = {
			[Op.between]: [fromDate, toDate],
		};
	}

	Object.keys(query).forEach((key) => {
		if (!NON_FILTER_PARAMS.includes(key)) {
			if (key === "title" && typeof query[key] === "string") {
				filters[key] = { [Op.iLike]: `%${query[key]}%` };
			} else if (key === "completedAt" || key === "createdAt" || key === "updatedAt") {
				const date = dayjs(query[key]).format("YYYY-MM-DD");
				filters[key] = {
					[Op.between]: [dayjs(date).startOf("day").toDate(), dayjs(date).endOf("day").toDate()],
				};
			} else {
				filters[key] = query[key];
			}
		}
	});

	// Process specific filters if needed
	if (filters.projectId) {
		filters.projectId = decodeHashId(filters.projectId as string);
	}

	return {
		filters,
		order,
		pagination: { page, limit, offset },
	};
};
