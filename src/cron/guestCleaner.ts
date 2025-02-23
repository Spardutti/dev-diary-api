import { CronJob } from "cron";
import { Op } from "sequelize";
import User from "../api/user/user.model";

// Create a new cron job
export const guestCleaner = new CronJob(
	"0 0 * * *", // Runs every minute
	async function () {
		try {
			const deletedCount = await User.destroy({
				where: {
					isGuest: true,
					expiresAt: {
						[Op.lt]: new Date(),
					},
				},
			});

			if (deletedCount > 0) {
				console.log("guest data cleared");
			} else {
				console.log("No expired guest users found.");
			}
		} catch (error) {
			console.error("Error deleting expired guest users:", error);
		}
	},
	null,
	true
);
