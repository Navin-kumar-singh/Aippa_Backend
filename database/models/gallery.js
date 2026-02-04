const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "gallery",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      theme: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      instituteName: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      coordinator: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      thumbnail: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "gallery",
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
