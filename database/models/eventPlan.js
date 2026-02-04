const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('eventPlan', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    track: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    theme: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    designation: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    instituteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: "instituteId"
    }
  }, {
    sequelize,
    tableName: 'eventPlan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "instituteId",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "instituteId" },
        ]
      },
    ]
  });
};
