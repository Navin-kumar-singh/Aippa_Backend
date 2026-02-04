const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "g20_delegates",
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
      designationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "g20_designation",
          key: "id",
        },
      },
      countryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "g20_country",
          key: "id",
        },
      },
      track: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      theme: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      cntry: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      desig: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "institutions",
          key: "id",
        },
      }
    },
    {
      sequelize,
      tableName: "g20_delegates",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "FK__studentsdelegate",
          using: "BTREE",
          fields: [{ name: "studentId" }],
        },
        {
          name: "FK__g20_designation",
          using: "BTREE",
          fields: [{ name: "designationId" }],
        },
        {
          name: "FK__g20_country",
          using: "BTREE",
          fields: [{ name: "countryId" }],
        },
        {
          name: "FK_g20_delegates_institutions",
          using: "BTREE",
          fields: [{ name: "instituteId" }],
        },
      ],
    }
  );
};
