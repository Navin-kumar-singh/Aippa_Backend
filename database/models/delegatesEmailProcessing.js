const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "delegatesEmailProcessing",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      }, 
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      flag: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      desig: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      cntry: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      event: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      institution_name:{
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "delegatesEmailProcessing",
      timestamps: false,
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
