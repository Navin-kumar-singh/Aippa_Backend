const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('carbonCredit', {
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
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:0
    },
    
    
  }, {
    sequelize,
    tableName: 'carbonCredit',
    timestamps: true,
   
  });
};
