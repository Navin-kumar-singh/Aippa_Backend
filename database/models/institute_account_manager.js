const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('institute_account_manager', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    designation: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    
    instituteId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    studentId:{
        type: DataTypes.INTEGER,
      allowNull: true
    },
    type_of_manager:{
        type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'institute_account_manager',
    timestamps: true,
    
  });
};
