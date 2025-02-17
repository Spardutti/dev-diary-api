"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.removeColumn("users", "todayNoteId");
		const tableDesc = await queryInterface.describeTable("users");

		// Check if the column already exists before adding it
		if (!tableDesc.todayNoteId) {
			await queryInterface.addColumn("users", "todayNoteId", {
				type: Sequelize.UUID,
				allowNull: true,
			});
		}
	},

	async down(queryInterface) {
		const tableDesc = await queryInterface.describeTable("users");

		// Check if the column already exists before adding it
		if (!tableDesc.todayNoteId) {
			await queryInterface.addColumn("users", "todayNoteId", {
				type: Sequelize.UUID,
				allowNull: true,
			});
		}
	},
};
