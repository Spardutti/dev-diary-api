"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn("notes", "projectId", {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "projects",
				key: "id",
			},
			onDelete: "CASCADE",
		});

		await queryInterface.changeColumn("projects", "userId", {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
			onDelete: "CASCADE",
		});

		await queryInterface.changeColumn("snippets", "userId", {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
			onDelete: "CASCADE",
		});

		await queryInterface.changeColumn("summaries", "projectId", {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "projects",
				key: "id",
			},
			onDelete: "CASCADE",
		});

		await queryInterface.changeColumn("todos", "projectId", {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "projects",
				key: "id",
			},
			onDelete: "CASCADE",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.changeColumn("notes", "projectId", {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "projects",
				key: "id",
			},
		});

		await queryInterface.changeColumn("projects", "userId", {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
		});

		await queryInterface.changeColumn("snippets", "userId", {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
		});

		await queryInterface.changeColumn("summaries", "projectId", {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "projects",
				key: "id",
			},
		});
		await queryInterface.changeColumn("todos", "projectId", {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "projects",
				key: "id",
			},
		});
	},
};
