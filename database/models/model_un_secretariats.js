const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('model_un_secretariats', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    designation: {
      type: DataTypes.STRING(500),
    },
    typeId: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    typeName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    slots: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
      },
    updatedAt: {
    type: DataTypes.DATE,
    }
    }, {
    tableName: 'model_un_secretariats',
    timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
    }
  });
};
