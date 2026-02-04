const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('model_un_pressCorps', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    role: {
      type: DataTypes.STRING(500),
    },
    
    createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      }
    }, {
      tableName: 'model_un_pressCorps',
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
  });
};
