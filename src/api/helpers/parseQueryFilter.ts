import { decodeHashId } from "../helpers/hashid";

export interface ParsedQuery {
	filters: Record<string, any>;
	order: [string, string][];
}

export const parseQueryFilters = (query: Record<string, any>): ParsedQuery => {
	const { orderBy, orderDirection, ...filters } = query;

	const order: [string, string][] = [];
	if (orderBy) {
		const orderByFields = typeof orderBy === "string" ? orderBy.split(",") : [];
		const orderDirections = typeof orderDirection === "string" ? orderDirection.split(",") : [];

		orderByFields.forEach((field, index) => {
			const direction = orderDirections[index]?.toLowerCase() === "asc" ? "ASC" : "DESC";
			order.push([field.trim(), direction]);
		});
	}

	if (filters.projectId) {
		filters.projectId = decodeHashId(filters.projectId as string);
	}

	return { filters, order };
};
