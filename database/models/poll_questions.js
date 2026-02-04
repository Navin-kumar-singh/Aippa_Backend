const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('poll_questions', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    poll_ques: {
      type: DataTypes.STRING(2000),
      allowNull: false
    },
    options: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      defaultValue: "0"
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "ACTIVE"
    }
  }, {
    sequelize,
    tableName: 'poll_questions',
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
