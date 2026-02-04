const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "institute_reg_details",
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      institute_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_account_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type_of_inst: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type_of_college: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      education_board: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      udise_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      medium_of_education: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      district: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pinCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
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
      proof_of_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      proof_of_address: {
        type: DataTypes.STRING,
        allowNull: true,
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
      designation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      admin_state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      admin_district: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      admin_street: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      admin_city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      admin_pincode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      student_verification: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      on_board_status:{
        type:DataTypes.BOOLEAN,
        allowNull:true,
        defaultValue:false
      },
      total_teacher: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      total_student: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "institute_reg_details",
      timestamps: true,
     
    }
  );
};
