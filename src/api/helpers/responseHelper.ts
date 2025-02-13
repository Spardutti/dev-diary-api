export const createResponse = (status: 200 | 201, data = {}) => {
	return {
		status,
		data,
	};
};
