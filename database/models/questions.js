const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('questions', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'quiz',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ques: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    ans: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    options: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    desc: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'questions',
    timestamps: false,
    indexes: [
      {
        name: "id",
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "FK_questions_quiz",
        using: "BTREE",
        fields: [
          { name: "quizId" },
        ]
      },
    ]
  });
};
