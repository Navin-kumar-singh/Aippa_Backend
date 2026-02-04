const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('student_coordinators', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    studentId: {
        type: DataTypes.INTEGER,
        reference: {
          model:'students',
          key: 'id'
        },
        unique: false,
      },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    contact: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    instituteId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    Sequelize,
    tableName: 'student_coordinators',
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
      {
        name: "FK__coordinate_student",
        using: "BTREE",
        fields: [
          { name: "studentId" },
        ]
      },
    ]
  });
};
