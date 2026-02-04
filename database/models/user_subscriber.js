const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "user_subscriber",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
     
      
    },
    {
      sequelize,
      tableName: "user_subscriber",
      timestamps: true,
      
    }
  );
};
