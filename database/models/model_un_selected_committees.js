const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('model_un_selected_committees', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    registerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'model_un_register',
          key: 'id'
        }
    },
    committeeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'model_un_committees',
          key: 'id'
        }
      },
      committee: {
      type: DataTypes.STRING(500),
    //   allowNull: false
    },
    tracks:{
      type: DataTypes.JSON,
      allowNull:true
    },
    slots: {
      type: DataTypes.STRING(500),
    //   allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      }
    }, {
      tableName: 'model_un_selected_committees',
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
  });
};
