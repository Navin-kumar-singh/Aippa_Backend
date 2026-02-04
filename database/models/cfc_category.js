const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cfc_category', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
   
    title: {
      type: DataTypes.STRING(400),
      allowNull: true
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
    tableName: 'cfc_category',
    timestamps: true,
   
  });
};
