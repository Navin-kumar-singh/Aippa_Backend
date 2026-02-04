const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "gallery_images",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      link: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      display: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "public",
      },
    },
    {
      sequelize,
      tableName: "gallery_images",
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
