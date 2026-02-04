const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "offline_event_images",
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
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      link: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "offline_event_images",
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
