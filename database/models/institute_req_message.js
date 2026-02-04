const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "institute_req_message",
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

      message: {
        type: DataTypes.STRING,
        defaultValue: false, 
      },
      
    },
    {
      tableName: "institute_req_message",
      timestamps: true,
     
    }
  );
};
