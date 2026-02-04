const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "stateWiseContent",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      state: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      link: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      qoute: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      qouteBy: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      courseIntro: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "stateWiseContent",
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
