const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('blogs', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "",
      unique: "slug"
    },
    heading: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    img: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: ""
    },
    bgimg: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: ""
    },
    author: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'blogs',
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
