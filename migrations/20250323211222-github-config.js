"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("github-config", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},

			installationId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			repo: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			owner: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			author: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			projectId: {
				type: Sequelize.UUID,
				allowNull: false,
				unique: true,
				references: {
					model: "projects",
					key: "id",
				},
			},

			createdAt: {
				type: Sequelize.DATE,
				defaultValue: null,
				allowNull: true,
			},
			updatedAt: {
				type: Sequelize.DATE,
				defaultValue: null,
				allowNull: true,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		queryInterface.dropTable("github-config");
	},
};
