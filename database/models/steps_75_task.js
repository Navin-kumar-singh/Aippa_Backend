const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('steps_75_task', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    day_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    credit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    description: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    
    
  }, {
    sequelize,
    tableName: 'steps_75_task',
    timestamps: true,
   
  });
};
