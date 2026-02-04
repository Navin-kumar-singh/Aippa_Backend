const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clubs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          isIn: [['private', 'public']], 
        },
        defaultValue:'private'
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instituteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    members: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    rules:{
      type: DataTypes.JSON,
      allowNull: true,
    }, 
    info: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    
    
  },{
    tableName: 'clubs',
    timestamps: true,
  });
};
