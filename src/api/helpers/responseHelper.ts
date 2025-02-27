export const createResponse = (status: 200 | 201 | 204, data = {}, pagination = {}) => {
	return {
		status,
		data,
		pagination,
	};
};
