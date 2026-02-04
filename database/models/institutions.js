const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "institutions",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      affiliate_id: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      institution_name: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING(500),
        allowNull: true,
        unique: "slug",
      },
      institution_address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      bio: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      logo: {
        type: DataTypes.CHAR(255),
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      first_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      middle_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      district: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      pincode: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contact: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        allowNull: true,
        values: ["active", "pending", "inactive", "deleted", "verified"],
        defaultValue: "inactive",
      },
      statuskey: {
        type: DataTypes.STRING(350),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      fb: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
      },
      insta: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
      },
      lkd: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
      },
      twitter: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
      },
      ytb: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
      },
      isAssigned: {
        type: DataTypes.ENUM,
        values: ["false", "true"],
        defaultValue: "false",
      },
      isPlanned: {
        type: DataTypes.ENUM,
        values: ["false", "true"],
        defaultValue: "false",
      },
      club: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      page: {
        type: DataTypes.STRING(5000),
        allowNull: true,
      },
      permissions: {
        type: DataTypes.STRING(5000),
        allowNull: true,
      },
      total_teacher: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      total_student: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    
    },
    
    {
      sequelize,
      tableName: "institutions",
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
