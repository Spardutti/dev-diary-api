import { DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../../config/database";
import { encodeHashId } from "../helpers/hashid";

class GitHubConfig extends Model<InferAttributes<GitHubConfig, { omit: "hashId" | "projectHashId" }>, InferCreationAttributes<GitHubConfig, { omit: "id" | "createdAt" | "updatedAt" | "hashId" | "projectHashId" }>> {
    declare id: string;
    declare installationId: string;
    declare repo: string;
    declare owner: string;
    declare author: string;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare projectId: string;

    get projectHashId(): string {
        return encodeHashId(this.projectId);
    }

    get hashId(): string {
        return encodeHashId(this.id);
    }
}

GitHubConfig.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv4(),
        },
        installationId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        repo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        owner: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        projectId: {
            type: DataTypes.UUID,
            allowNull: false,
            onDelete: "CASCADE",
            unique: true,
            references: {
                model: "projects",
                key: "id",
            },
        },
    },
    {
        sequelize,
        tableName: "github-config",
        timestamps: true,
    }
);

export default GitHubConfig;
