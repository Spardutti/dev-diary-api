"use strict";

const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("users", {
			id: {
				type: DataTypes.UUID,
				defaultValue: uuidv4,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			lastVisitedProjectId: {
				type: DataTypes.UUID,
				allowNull: true,
				defaultValue: null,
			},

			isGuest: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},

			expiresAt: {
				type: DataTypes.DATE,
				defaultValue: null,
				allowNull: true,
			},
			createdAt: {
				type: DataTypes.DATE,
				defaultValue: null,
				allowNull: true,
			},
			updatedAt: {
				type: DataTypes.DATE,
				defaultValue: null,
				allowNull: true,
			},
		});
	},

	down: async (queryInterface) => {
		await queryInterface.dropTable("users");
	},
};
