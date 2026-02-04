const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('model_un_register', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    instituteId : {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    event_type: {
      type: DataTypes.TEXT,
    },
    event_time: {
      type: DataTypes.STRING,
    },
    event_venue: {
      type: DataTypes.TEXT,
    },
    format: {
      type: DataTypes.TEXT,
    },
    event_theme : {
      type: DataTypes.TEXT
    },
    sub_theme : {
      type: DataTypes.TEXT
    },
    event_venue:{
      type: DataTypes.TEXT,
    },
    event_time:{
      type: DataTypes.TEXT,
    },
    last_date: {
      type: DataTypes.TEXT,
    },
    date_proposed: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    }, 
    
  }, {
    tableName: 'model_un_register',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  });
};
