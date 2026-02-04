const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "institute_onboard",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "institutions",
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
      question4: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      question5: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      question6: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      question7: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      question8: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      question9: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      appointment_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      theme: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      coordinators: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "institute_onboard",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "FK__institutions",
          using: "BTREE",
          fields: [{ name: "instituteId" }],
        },
      ],
    }
  );
};
