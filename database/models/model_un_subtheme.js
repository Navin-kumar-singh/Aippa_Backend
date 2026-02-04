const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('model_un_subtheme', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sub_theme_title: {
        type: DataTypes.TEXT,
        // allowNull: false,
      },
      mainthemeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'model_un_eventtheme',
          key: 'id'
        }
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      }
    }, {
      tableName: 'model_un_subtheme',
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
  });
};
