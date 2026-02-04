const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "riasecCareer",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      R: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: true,
      },
      A: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: true,
      },
      I: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: true,
      },
      S: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: true,
      },
      E: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: true,
      },
      C: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: true,
      },
      Career1: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1000,
          max: 1303,
        },
        references: {
          model: "riasecCareerList",
          key: "careerId",
        },
      },
      Career2: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1000,
          max: 1303,
        },
        references: {
          model: "riasecCareerList",
          key: "careerId",
        },
      },
      Career3: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1000,
          max: 1303,
        },
        references: {
          model: "riasecCareerList",
          key: "careerId",
        },
      },
      Career4: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1000,
          max: 1303,
        },
        references: {
          model: "riasecCareerList",
          key: "careerId",
        },
      },
      Career5: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1000,
          max: 1303,
        },
        references: {
          model: "riasecCareerList",
          key: "careerId",
        },
      },
      Career6: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1000,
          max: 1303,
        },
        references: {
          model: "riasecCareerList",
          key: "careerId",
        },
      },
      Career7: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1000,
          max: 1303,
        },
        references: {
          model: "riasecCareerList",
          key: "careerId",
        },
      },
      Career8: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1000,
          max: 1303,
        },
        references: {
          model: "riasecCareerList",
          key: "careerId",
        },
      },
    },
    {
      tableName: "riasecCareer",
      timestamps: true,
    }
  );
};
