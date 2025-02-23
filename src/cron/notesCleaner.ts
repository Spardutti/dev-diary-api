import { CronJob } from "cron";
import { Op } from "sequelize";
import Note from "../api/note/note.model";

// Create a new cron job
export const NotesCleaner = new CronJob(
	"0 1 * * *", // Runs every minute
	async function () {
		try {
			const deletedCount = await Note.destroy({
				where: {
					createdAt: {
						[Op.lt]: new Date(),
					},
					[Op.or]: [{ content: "" }, { content: "<p></p>" }],
				},
			});

			if (deletedCount > 0) {
				console.log("notes cleared", deletedCount);
			} else {
				console.log("No notes found.");
			}
		} catch (error) {
			console.error("Error deleting notes:", error);
		}
	},
	null,
	true
);
