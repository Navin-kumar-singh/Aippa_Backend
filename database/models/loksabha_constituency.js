const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('loksabha_constituency', {
    District: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'loksabha_constituency',
    timestamps: false
  });
};
