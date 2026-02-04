const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('model_un_committees', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    committees: {
      type: DataTypes.STRING(500),
    //   allowNull: false
    },
    type: {
      type: DataTypes.STRING(500),
    //   allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
      minSlots:{
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:15
      },
      detail:{
        type: DataTypes.JSON,
      }
    }, {
      tableName: 'model_un_committees',
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
  });
};
