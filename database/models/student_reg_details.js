const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "student_reg_details",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      institution_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      institute_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_account_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      gender:{
        type:DataTypes.STRING,
        allowNull:true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      on_board_status:{
        type:DataTypes.BOOLEAN,
        allowNull:true,
        defaultValue:false
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      curriculum: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      activities: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      interests: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      experience: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      achievements: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date_of_birth: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      facebook_acc: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      twitter_acc: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      linkedin_acc: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      insta_acc: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      youtube_acc: {
        type: DataTypes.STRING,
        allowNull: true,
      },
   
    
 
     
    },
    {
      tableName: "student_reg_details",
      timestamps: true,
     
    }
  );
};
