const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('certificates', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: 'students',
      //   key: 'id'
      // }
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: 'courses',
      //   key: 'id'
      // }
    },
    img: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    certificate_key: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    accredited_by: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    endorsed_by: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    generated: {
      type: DataTypes.ENUM('TRUE','FALSE'),
      allowNull: true,
      defaultValue: "TRUE"
    }
  }, {
    sequelize,
    tableName: 'certificates',
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
        name: "FK_certificates_students",
        using: "BTREE",
        fields: [
          { name: "studentId" },
        ]
      },
      {
        name: "FK_certificates_courses",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
    ]
  });
};
