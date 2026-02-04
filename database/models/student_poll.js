const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('student_poll', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    poll_question_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    vote: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'student_poll',
    timestamps: false,
    indexes: [
      {
        name: "id",
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
