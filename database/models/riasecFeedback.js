const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "riasecFeedback",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      teacherFeedback: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
      instituteFeedback: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      tableName: "riasecFeedback",
      timestamps: true,
    }
  );
};
