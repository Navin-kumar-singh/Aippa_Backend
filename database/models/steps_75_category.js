const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('steps_75_category', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
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
    tableName: 'steps_75_category',
    timestamps: true,
   
  });
};
