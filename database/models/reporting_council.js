const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reporting_council', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'students',
        key: 'id'
      }
    },
    instituteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'institutions',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'reporting_council',
    timestamps: false,
    indexes: [
      {
        name: "FK__reporting_students",
        using: "BTREE",
        fields: [
          { name: "studentId" },
        ]
      },
      {
        name: "FK__reporting_institutions",
        using: "BTREE",
        fields: [
          { name: "instituteId" },
        ]
      },
    ]
  });
};
