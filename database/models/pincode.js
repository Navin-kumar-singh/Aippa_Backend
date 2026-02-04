const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pincode', {
    PostOfficeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Pincode: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    City: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    District: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    State: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pincode',
    timestamps: false
  });
};
