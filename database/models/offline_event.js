const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "offline_event",
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
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      certificate_key: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "offline_event",
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
