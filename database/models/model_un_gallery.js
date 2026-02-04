const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "model_un_gallery",
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
      eventType: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'YMUN',
      },
    },
    {
      sequelize,
      tableName: "model_un_gallery",
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
