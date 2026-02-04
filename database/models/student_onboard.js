const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "student_onboard",
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
      question1: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      question2: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      question3: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      class: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      classOrder: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      countryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reporting_councilId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      designationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      topicId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sub_topicId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reporting_council: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "student_onboard",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "FK_student_onboard_students",
          using: "BTREE",
          fields: [{ name: "studentId" }],
        },
      ],
    }
  );
};
