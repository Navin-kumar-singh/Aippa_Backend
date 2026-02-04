const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "institutecbse_alt_details",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      school_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      affiliate_number: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "institutecbse_alt_details",
      timestamps: true,
    }
  );
};
