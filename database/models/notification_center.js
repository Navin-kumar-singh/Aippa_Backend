const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("notification_center", {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
   
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      
      },
      message: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("unread", "read"),
        allowNull: true,
        defaultValue: "unread",
      },
      recieved: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      role: {
        type: DataTypes.ENUM("student", "teacher", "coordinator", 'institute-coordinator'), 
        allowNull: false,
        defaultValue: 'student'
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "notification_center",
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      },
    }
  );
};
