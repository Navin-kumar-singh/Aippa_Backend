const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "institute_gallery",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      img: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      alttext: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      permission: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "institute_gallery",
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
