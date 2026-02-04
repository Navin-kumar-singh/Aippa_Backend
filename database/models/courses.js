const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('courses', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    course_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "slug"
    },
    desc: {
      type: DataTypes.STRING(3000),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    thumbnail: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    author: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    course_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    certification: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    certification_img: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    access_time: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'courses',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "slug",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "slug" },
        ]
      },
    ]
  });
};
