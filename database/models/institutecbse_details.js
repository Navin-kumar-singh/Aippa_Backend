const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "institutecbse_details",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      affliate_number: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      institution_name: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING(25),
        allowNull: true,
    },
    district: {
        type: DataTypes.STRING(25),
        allowNull: true,
    },
    level: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contact: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      pincode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stdcode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "institutecbse_details",
      timestamps: true,
    }
  );
};
