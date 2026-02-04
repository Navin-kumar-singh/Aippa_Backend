const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('days_21_task_performance', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    role: {
        type: DataTypes.STRING(400),
        allowNull: true
    },
    instituteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    attemptId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(400),
      allowNull: true,
      defaultValue:'pending'
  },
    experience: {
        type: DataTypes.STRING(400),
        allowNull: true
    },
    images: {
        type: DataTypes.STRING(400),
        allowNull: true
    },
    credit_earned: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'days_21_task_performance',
    timestamps: true,
   
  });
};
