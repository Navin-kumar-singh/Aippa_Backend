const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('model_un_eventformat', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    event_format: {
      type: DataTypes.TEXT,
    //   allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
    //   allowNull: false
    },
    event_content: {
      type: DataTypes.TEXT,
    //   allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      }
    }, {
      tableName: 'model_un_eventformat',
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
  });
};
