import User from "../user/user.model";

export const serializeUser = (user: User) => ({
	id: user.hashId,
	name: user.name,
	email: user.email,
	lastVisitedProjectId: user.lastVisitedProjectHash,
	isGuest: user.isGuest,
});
