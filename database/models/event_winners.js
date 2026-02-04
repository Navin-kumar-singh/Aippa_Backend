const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "event_winners",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        reference: {
          model: "students",
          key: "id",
        },
        unique: false,
      },
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      event: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      position: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      Sequelize,
      tableName: "event_winners",
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
