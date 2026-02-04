const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "additional_certificates",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "students",
          key: "id",
        },
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "courses",
          key: "id",
        },
      },
      contest: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      img: {
        type: DataTypes.STRING(400),
        allowNull: true,
      },
      certificate_key: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      accredited_by: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      endorsed_by: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      generated: {
        type: DataTypes.ENUM("TRUE", "FALSE"),
        allowNull: true,
        defaultValue: "TRUE",
      },
    },
    {
      sequelize,
      tableName: "additional_certificates",
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
