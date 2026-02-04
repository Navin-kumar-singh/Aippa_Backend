const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("discussion_reply", {
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
    chat_id:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    type: {
        type: DataTypes.TEXT,
        allowNull: true
      },
  },
    {
      sequelize,
      tableName: "discussion_reply",
      timestamps: true,
    })
}