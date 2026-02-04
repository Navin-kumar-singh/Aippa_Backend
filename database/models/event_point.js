const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "event_point",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      text: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      upvote: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      downvote: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      roomId: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      track: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      theme: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      report: {
        type: DataTypes.STRING(5000),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "event_point",
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
