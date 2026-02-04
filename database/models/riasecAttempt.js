const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "riasecAttempt",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "students",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      result: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      attemptCount: {
        // For differentiating between attendees and not (Premium attempt feature as well)
        type: DataTypes.INTEGER(2),
        allowNull: true,
      },
    },
    {
      tableName: "riasecAttempt",
      timestamps: true,
    }
  );
};
