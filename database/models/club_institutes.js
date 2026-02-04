const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('club_institutes', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "institutions", 
        key: "id", 
      },
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false,
      defaultValue:"",
    },
    small_bio:{
      type:DataTypes.STRING,
      allowNull:false,
      defaultValue:"",
    },
    about:{
      type:DataTypes.STRING,
      allowNull:false,
      defaultValue:"",
      
    },
    achievements:{
      type:DataTypes.JSON,
      allowNull:false,
      defaultValue:[]
    },
    
    extra_curriculum:{
      type:DataTypes.JSON,
      allowNull:false,
      defaultValue:[]
    },
    experience:{
      type:DataTypes.JSON,
      allowNull:false,
      defaultValue:[]
    },

    skills:{
      type:DataTypes.JSON,
      allowNull:false,
      defaultValue:[]
    },

    project:{
      type:DataTypes.JSON,
      allowNull:false,
      defaultValue:[],
    },

      all_clubs: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
      },
      
      
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
  }, 
  );
};
