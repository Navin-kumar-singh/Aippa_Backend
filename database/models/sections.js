const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sections', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(250),
      allowNull: true,
      defaultValue: "active"
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    order: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sections',
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
        name: "FK__courses",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
    ]
  });
};
