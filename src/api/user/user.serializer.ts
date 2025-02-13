import User from "@/api/user/user.model";

export const serializeUser = (user: User) => ({
	id: user.id,
	name: user.name,
	email: user.email,
	lastVisitedProjectId: user.lastVisitedProjectId,
});
