export const createResponse = (status: 200 | 201 | 204, data = {}) => {
	return {
		status,
		data,
	};
};
