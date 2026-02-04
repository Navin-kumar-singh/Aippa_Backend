const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('model_un_secretariats_member', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    studentId:{
        type: DataTypes.INTEGER,
      allowNull: true,
    },
    instituteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    registerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    name : {
        type: DataTypes.TEXT
    },
    assign_designation: {
        type: DataTypes.TEXT,
    },
    email : {
      type: DataTypes.TEXT
    },
    phone: {
      type: DataTypes.STRING,
    },
    role : {
        type: DataTypes.TEXT,
    },
    selectedCommittee : {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    }
  }, {
    tableName: 'model_un_secretariats_member',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  });
};
