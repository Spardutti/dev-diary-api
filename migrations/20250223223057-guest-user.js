"use strict";

const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		const hashedPassword = await bcrypt.hash("GuestUser1", 10);

		await queryInterface.bulkInsert("users", [
			{
				id: "00000000-0000-0000-0000-000000000000",
				name: "Guest",
				email: "guest@guest.guest",
				password: hashedPassword,
				isGuest: true,
				lastVisitedProjectId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);

		await queryInterface.bulkInsert("projects", [
			{
				id: "11111111-1111-1111-1111-111111111111",
				name: "Guest Project",
				description: "Guest Project Description",
				userId: "00000000-0000-0000-0000-000000000000",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);

		await queryInterface.bulkUpdate("users", { lastVisitedProjectId: "11111111-1111-1111-1111-111111111111" }, { id: "00000000-0000-0000-0000-000000000000" });
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete("projects", {
			id: "11111111-1111-1111-1111-111111111111",
		});

		await queryInterface.bulkDelete("users", {
			id: "00000000-0000-0000-0000-000000000000",
		});
	},
};
