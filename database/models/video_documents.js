const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('video_documents', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    path: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(250),
      allowNull: true,
      defaultValue: "active"
    },
    title: {
      type: DataTypes.STRING(350),
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      references: {
        model: 'sections',
        key: 'id'
      }
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'video_documents',
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
        name: "FK__sections",
        using: "BTREE",
        fields: [
          { name: "sectionId" },
        ]
      },
    ]
  });
};
