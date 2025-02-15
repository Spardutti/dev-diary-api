import { Request, Response, NextFunction } from "express";
import passport from "../../config/passportConfig";
import User from "../user/user.model";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate("jwt", { session: false }, (err: Error | null, user: User | false) => {
		if (err || !user) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		req.user = user;
		next();
	})(req, res, next);
};

export default authMiddleware;
