const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "event_vote",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      vote: {
        type: DataTypes.ENUM,
        allowNull: true,
        values: ["up", "down"],
        defaultValue: "up",
      },
      point_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "event_vote",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        }
      ],
    }
  );
};
