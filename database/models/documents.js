const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "documents",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      desc: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      link: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      img: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      file: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      note: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      instituteId: {
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
      tableName: "documents",
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
