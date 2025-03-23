export const createResponse = (status: 200 | 201 | 204 | 400, data = {}, pagination = {}) => {
	return {
		status,
		data,
		pagination,
	};
};
