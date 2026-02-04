const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "teacher_register",
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
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, 
      },
      
    },
    {
      tableName: "teacher_register",
      timestamps: true,
    
    }
  );
};
