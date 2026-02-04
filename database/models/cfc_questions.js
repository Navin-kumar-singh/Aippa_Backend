const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cfc_questions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cat_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    text: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    type: {
        type: DataTypes.STRING(400),
        allowNull: true
      },
    points: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    options: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    correct: {
    type: DataTypes.JSON,
    allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true, 
    },
    
  }, {
    sequelize,
    tableName: 'cfc_questions',
    timestamps: true,
   
  });
};
