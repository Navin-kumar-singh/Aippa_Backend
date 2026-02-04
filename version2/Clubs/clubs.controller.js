const { DBMODELS } = require("../../database/models/init-models");

const sequelize = require("../../database/connection");


const getAllClubMemberByClubId = async(req,res)=>{
    const {clubId} = req.params
    try {
        const allMember  = await DBMODELS.club_members.findAll({
            where:{
                clubId
            }
        })
        return res.json({
            message:'succesfully get all memeber ', 
            result:{
                count:allMember?.length,
                data:allMember
            }
        })
    } catch (error) {
        return res.json({
            message:'internal server error', 
            error:error.message
        })
    }
}

const checkIfUserJoined = async(req,res)=>{
    const {clubId, userId, role} = req.params
    try {
        const member  = await DBMODELS.club_members.findOne({
            where:{
                clubId,
                userId,
                role,
            }, raw:true
        })
        if(member){
            return res.json({
                message:'Already joined', 
                result:member
            })
        }
        return res.json({
            message:'User not Joined Yet', 
            result:false
        })
      
    } catch (error) {
        return res.json({
            message:'internal server error', 
            error:error.message
        })
    }
}

const joinClub = async(req,res)=>{
    const {clubId, userId, role, instituteId} = req.params
    try {
        const isPresent = await DBMODELS.club_members.count({
            where:{
                clubId, userId, role, instituteId
            }
        })
        if(!isPresent){

            const member  = await DBMODELS.club_members.create({clubId, userId, role, instituteId})
            return res.json({
                message:'Succesfully Joined', 
                result:member?.dataValues
            })
        }
        return res.json({
            message:'already present'
        })
       
      
    } catch (error) {
        return res.json({
            message:'internal server error', 
            error:error.message
        })
    }
}


const leftClub = async(req,res)=>{
    const {clubId, userId, role} = req.params
    try {
        const member  = await DBMODELS.club_members.destroy(
           { where:{clubId, userId, role, instituteId}}
        )
       
        return res.json({
            message:'Succesfully Joined', 
            result:member?.dataValues
        })
      
    } catch (error) {
        return res.json({
            message:'internal server error', 
            error:error.message
        })
    }
}





module.exports = {
    getAllClubMemberByClubId,
    checkIfUserJoined,
    joinClub,
    leftClub,
}
