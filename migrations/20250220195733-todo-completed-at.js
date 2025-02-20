"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const tableDesc = await queryInterface.describeTable("todos");

		// Add columns if they don't exist
		if (!tableDesc.completedAt) {
			await queryInterface.addColumn("todos", "completedAt", {
				type: Sequelize.DATE,
				allowNull: true, // Allow NULL for now
			});
		}

		await queryInterface.sequelize.query(`
			UPDATE "todos"
			SET "completedAt" = "updatedAt"
			WHERE "status" = true AND "completedAt" IS NULL;
		`);
	},

	async down(queryInterface) {
		await queryInterface.removeColumn("todos", "completedAt");
	},
};
