const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('model_un_eventcoordinator', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    instituteId: {
      type: DataTypes.INTEGER,
      // allowNull: true,
    },
    registerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'model_un_register',
          key: 'id'
        }
    },
    name : {
        type: DataTypes.TEXT
    },
    designation: {
        type: DataTypes.TEXT,
    },
    email : {
      type: DataTypes.TEXT
    },
    phone: {
      type: DataTypes.INTEGER,
    },
    typeOfCoordinator : {
        type: DataTypes.TEXT,
    },
    role : {
        type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    }
  }, {
    tableName: 'model_un_eventcoordinator',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  });
};
