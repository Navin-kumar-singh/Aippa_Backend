const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('club_members', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instituteId: {
        type: DataTypes.INTEGER, 
        allowNull: true,
       
    },
    clubId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  
   
  },
  {
    sequelize,
    tableName: "club_members",
    timestamps: true,
   
  }
  );
};
