const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('student_quiz', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      }
    },
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_question: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_attemted: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_correct: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    result: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    progress: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'student_quiz',
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
        name: "FK_student_quiz_students",
        using: "BTREE",
        fields: [
          { name: "studentId" },
        ]
      },
    ]
  });
};
