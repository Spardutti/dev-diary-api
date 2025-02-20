"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const tableDesc = await queryInterface.describeTable("todos");

		// Check if the column already exists before adding it
		if (!tableDesc.priority) {
			await queryInterface.addColumn("todos", "priority", {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				validate: {
					isIn: [[0, 1, 2, 3]],
				},
			});
		}
	},

	async down(queryInterface) {
		await queryInterface.removeColumn("todos", "priority");
	},
};
