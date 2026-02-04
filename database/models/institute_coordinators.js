const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('institute_coordinators', {
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
    contact: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    designation: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instituteId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'institute_coordinators',
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
        name: "FK__coordinate_institutions",
        using: "BTREE",
        fields: [
          { name: "instituteId" },
        ]
      },
    ]
  });
};
