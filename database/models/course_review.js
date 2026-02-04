const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('course_review', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rating: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      // references: {
      //   model: 'courses',
      //   key: 'id'
      // }
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: 'students',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'course_review',
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
        name: "FK__students",
        using: "BTREE",
        fields: [
          { name: "studentId" },
        ]
      },
      {
        name: "FK__coursesId",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
    ]
  });
};
