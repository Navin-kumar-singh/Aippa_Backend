const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "notification",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      heading: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      subHeading: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      desc: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      unique_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reference_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      seen: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "false",
      },
      permission: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "{}",
      },
    },
    {
      sequelize,
      tableName: "notification",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
