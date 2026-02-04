const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("discussion_point", {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    institute_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    discussion_id: { 
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
    type: {
        type: DataTypes.TEXT,
        allowNull: false
      },
  },
    {
      sequelize,
      tableName: "discussion_point",
      timestamps: true,
    })
}