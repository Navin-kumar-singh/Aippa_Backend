const Sequelize = require('sequelize');
module.exports=function(sequelize,DataTypes){
    return sequelize.define("discussion_attendees",{
        id:{
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        discussion_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        },
        institute_id:{
            type:DataTypes.INTEGER,
            allowNull:true,
        },
        role:{
            type:DataTypes.STRING(),
            allowNull:true
        }, 
        attend_type:{
            type:DataTypes.STRING,
            allowNull:true
        }
      
    },  {
        sequelize,
        tableName: "discussion_attendees",
        timestamps: true,
    }
    )}