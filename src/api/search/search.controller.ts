import { DataTypes, Op, WhereOptions, Model, ModelStatic } from "sequelize";
import Todo from "../todo/todo.model";
import { Request, Response } from "express";
import { createResponse } from "../helpers/responseHelper";
import Project from "../project/project.model";
import { todoSerializer } from "../todo/todo.serializer";
import { projectSerializer } from "../project/project.serializer";

type SearchableModels = {
	[key: string]: ModelStatic<Model>;
};

const searchAble: SearchableModels = {
	todo: Todo,
	project: Project,
};

const serializers: { [key: string]: Function } = {
	todo: todoSerializer,
	project: projectSerializer,
};

const search = async (req: Request, res: Response): Promise<any> => {
	const { model } = req.params;
	const queryParams = req.query;

	if (!queryParams || Object.keys(queryParams).length === 0) {
		return res.status(400).json({ error: "At least one search parameter is required." });
	}

	const searchAbleModel = searchAble[model as keyof typeof searchAble];
	const serializer = serializers[model];

	if (!searchAbleModel) {
		return res.status(400).json({ error: "Invalid model specified." });
	}

	// Build the where clause dynamically
	const whereClause: WhereOptions = {};

	const attributes = searchAbleModel.getAttributes();

	for (const [key, value] of Object.entries(queryParams)) {
		if (attributes[key]) {
			const attributeType = attributes[key].type;

			if (attributeType instanceof DataTypes.STRING || attributeType instanceof DataTypes.TEXT) {
				// For string fields, use LIKE operator
				whereClause[key] = { [Op.iLike]: `%${value}%` };
			} else if (attributeType instanceof DataTypes.INTEGER || attributeType instanceof DataTypes.FLOAT || attributeType instanceof DataTypes.DECIMAL) {
				// For numeric fields, use exact match
				if (!isNaN(Number(value))) {
					whereClause[key] = value;
				} else {
					return res.status(400).json({ error: `Invalid value for numeric field: ${key}` });
				}
			} else {
				whereClause[key] = value;
			}
		} else {
			return res.status(400).json({ error: `Invalid field: ${key}` });
		}
	}

	try {
		const matches = await searchAbleModel.findAll({
			where: whereClause,
		});

		if (matches.length > 0) {
			return res.status(200).json(createResponse(200, serializer(matches)));
		} else {
			return res.status(404).json({ message: "No matching records found." });
		}
	} catch (error) {
		console.error("Search error:", error);
		return res.status(500).json({ error: "An error occurred during the search." });
	}
};

export const searchController = { search };
