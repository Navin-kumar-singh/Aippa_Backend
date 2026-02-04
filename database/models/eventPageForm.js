const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'eventPlanPage', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    subheading: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    quotes: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    author: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    subauthor: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    paragraph: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    images: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    carousel: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    ulpoints: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    cards: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'eventPlanPage',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
