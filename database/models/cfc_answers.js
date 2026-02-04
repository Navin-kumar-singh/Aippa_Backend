const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cfc_answers', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    type: {
        type: DataTypes.STRING(400),
        allowNull: true
      },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    answer: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    
  }, {
    sequelize,
    tableName: 'cfc_answers',
    timestamps: true,
   
  });
};
