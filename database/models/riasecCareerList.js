const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "riasecCareerList",
    {
      careerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      careerName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      careerDetails: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    },
    {
      tableName: "riasecCareerList",
    }
  );
};
