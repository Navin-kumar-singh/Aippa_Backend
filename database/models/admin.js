const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "admin",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      middle_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      state: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      pincode: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(5000),
        allowNull: true,
      },
      contact: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      profile: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      banner: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      role: {
        type: DataTypes.TEXT,
        allowNull: true,
        values: ["viewer", "editor", "blogger", "admin", "subAdmin"],
        defaultValue: "viewer",
      },
      Permissions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "admin",
      timestamps: false,
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
