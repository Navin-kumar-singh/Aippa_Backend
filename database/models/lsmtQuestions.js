const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "lsmtQuestions",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      option: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "lsmtQuestions",
      timestamps: true,
    }
  );
};
