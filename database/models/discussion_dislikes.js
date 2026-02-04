const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("discussion_dislikes", {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    role: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    institute_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    
    discussion_id: { 
        type: DataTypes.INTEGER,
        allowNull: true,
    },
   
  },
    {
      sequelize,
      tableName: "discussion_dislikes",
      timestamps: true,
    })
}