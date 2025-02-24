"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("summaries", {
			id: {
				type: Sequelize.UUID,
				primaryKey: true,
				defaultValue: Sequelize.UUIDV4,
			},
			noteContent: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			createdTodos: {
				type: Sequelize.JSONB,
				allowNull: true,
			},
			completedTodos: {
				type: Sequelize.JSONB,
				allowNull: true,
			},
			projectId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "projects",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		});

		await queryInterface.addIndex("summaries", ["projectId"]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("summaries");
	},
};
