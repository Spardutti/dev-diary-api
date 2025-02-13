import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import passport from "passport";
import dotenv from "dotenv";
import User from "@/api/user/user.model";

dotenv.config();

const options: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
	new JwtStrategy(options, async (payload, done) => {
		try {
			const user = await User.findByPk(payload.id);

			if (!user) {
				return done(null, false);
			}

			return done(null, user);
		} catch (error) {
			return done(error, false);
		}
	})
);

export default passport;
