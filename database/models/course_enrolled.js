const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('course_enrolled', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "active"
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: 'courses',
      //   key: 'id'
      // }
    },
    total_sections: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    section_progress: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "{\"progress\":[]}"
    },
    section_completed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'students',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'course_enrolled',
    timestamps: true,

  });
};
