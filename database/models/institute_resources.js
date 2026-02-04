const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "institute_resources",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title:{
        type:DataTypes.TEXT,
        allowNull:true
      },
      resource_link: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      resource_file: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        references: {
          model: "institutions",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "institute_resources",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "FK__institutions_resource",
          using: "BTREE",
          fields: [{ name: "instituteId" }],
        },
      ],
    }
  );
};
