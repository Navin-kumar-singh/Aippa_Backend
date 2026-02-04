const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("discussion_boards", {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    discussion_title: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_role: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    institute_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type:{
      type:DataTypes.STRING,
      allowNull:true
    }, 
    event_name:{
      type:DataTypes.STRING,
      allowNull:true,
    },
    committeeType:{
      type:DataTypes.STRING,
      allowNull:true,
    }


  },
    {
      sequelize,
      tableName: "discussion_boards",
      timestamps: true,
    })
}