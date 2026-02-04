const Sequelize = require('sequelize');
module.exports=function(sequelize,DataTypes){
    return sequelize.define("discussion_scoresheet",{
        id:{
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        discussion_id:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        scorer_id:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        participant_id:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        
        scorer_role:{
            type:DataTypes.STRING,
            allowNull:true
        }, 
        participant_role:{
            type:DataTypes.STRING,
            allowNull:true
        },
        total_score:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        scoreCard:{
            type:DataTypes.JSON,
            allowNull:true
        }
      
    },  {
        sequelize,
        tableName: "discussion_scoresheet",
        timestamps: true,
    }
    )}