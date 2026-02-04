const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('model_un_eventtheme', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    theme_title: {
        type: DataTypes.TEXT,
        // allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      }
    }, {
      tableName: 'model_un_eventtheme',
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
  });
};
