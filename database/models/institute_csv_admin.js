const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "institute_csv_admin",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      file_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "institutions",
          key: "id",
        },
      },
      role: {
        type: DataTypes.ENUM,
        allowNull: true,
        values: ["student", "teacher"],
        defaultValue: "student",
      },
      isUploaded: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      assignedTo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "admin",
          key: "id",
        },
      },
      sheetIndexes: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
    },
    {
      tableName: "institute_csv_admin",
      timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      },
    }
  );
};
