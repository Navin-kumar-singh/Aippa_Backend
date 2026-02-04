const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('days_21_attempt', {
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
    points_earned: {
        type: DataTypes.INTEGER,
        allowNull: true,
      defaultValue: 0,

    },
    start_date: {
      type: Sequelize.DATE, 
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  }, {
    sequelize,
    tableName: 'days_21_attempt',
    timestamps: true,
   
  });
};
