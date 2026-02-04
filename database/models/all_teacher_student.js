const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "all_teacher_student",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      middle_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      father_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      mother_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      guardian_one: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      guardian_two: {
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
      email: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contact: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM,
        allowNull: true,
        values: ["student", "teacher"],
        defaultValue: "student",
      },
      correctness: {
        type: DataTypes.ENUM,
        allowNull: true,
        values: ["correct", "incorrect", "NULL"],
        defaultValue: "NULL",
      },
      class: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      section: {
        type: DataTypes.STRING(5),
        allowNull: true,
        defaultValue: "",
      },
      stream: {
        type: DataTypes.STRING(11),
        allowNull: true,
        defaultValue: "",
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      isPresent: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      otherData: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "all_teacher_student",
      timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      },
    }
  );
};
