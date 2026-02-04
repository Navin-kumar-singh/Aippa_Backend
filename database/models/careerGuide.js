const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "careerGuide",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isAssigned: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "careerGuide",
      timestamps: true,
    }
  );
};
