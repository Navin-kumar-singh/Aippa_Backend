const { mysqlcon } = require("../../model/db");
const { DBMODELS } = require("../../database/models/init-models");
const sequelize = require("../../database/connection");

const checkDuplicateInstitute = async(req,res)=>{
   const {institution_name} = req.body;
   try {
      const institutes = await DBMODELS.institutions.findAll({
         where :{
            institution_name
         },
         attributes:{
            exclude:['password','affiliate_id','statuskey','isAssigned','isPlanned','permissions']
         }
      })
      if(institutes){
         return res.json({
            message:'match found',
            result:institutes
         })
      }
      else{
         return res.json({
            message:'no matching institute found',
            result:[]
         })
      }
      
   } catch (error) {
      return res.json(error.message)
   }
}

module.exports = { 
   checkDuplicateInstitute,
};
