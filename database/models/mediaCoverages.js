const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "mediaCoverages",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      desc: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "mediaCoverages",
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
