const Sequelize = require('sequelize');
module.exports= function (sequelize, DataTypes) {
    return sequelize.define(
      "model_un_mediaCoverage",
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING(300),
          allowNull: false,
        },
        desc: {
          type: DataTypes.STRING(1000),
          allowNull: false,
        },
        link: {
          type: DataTypes.STRING(300),
          allowNull: false,
        },
        img: {
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
        tableName: "model_un_mediaCoverage",
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
  