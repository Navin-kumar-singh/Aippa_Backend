const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "lsmtAttempt",
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
      tableName: "lsmtAttempt",
      timestamps: true,
    }
  );
};
