"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const tableDesc = await queryInterface.describeTable("users");

		// Check if the column already exists before adding it
		if (!tableDesc.lastLoggedIn) {
			await queryInterface.addColumn("users", "lastLoggedIn", {
				type: Sequelize.DATE,
				defaultValue: null,
				allowNull: true,
			});
		}
	},

	async down(queryInterface) {
		await queryInterface.removeColumn("users", "lastLoggedIn");
	},
};
