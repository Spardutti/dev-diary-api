import { decodeHashId } from "./hashid";

const NON_FILTER_PARAMS = ["page", "limit", "orderBy", "orderDirection"];

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

		orderByFields.forEach((field, index) => {
			const direction = orderDirections[index]?.toLowerCase() === "asc" ? "ASC" : "DESC";
			order.push([field.trim(), direction]);
		});
	} else {
		// Default order
		order.push(["createdAt", "DESC"]);
	}

	// Extract filters (everything that's not pagination or ordering)
	const filters: Record<string, any> = {};

	Object.keys(query).forEach((key) => {
		if (!NON_FILTER_PARAMS.includes(key)) {
			filters[key] = query[key];
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
