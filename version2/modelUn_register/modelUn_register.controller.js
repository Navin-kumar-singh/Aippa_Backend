const { Op} = require("sequelize");
const sequelize = require("../../database/connection");
const { DBMODELS } = require("../../database/models/init-models");
const sendEmailService = require("../../service/email");
const cron = require('node-cron');
const moment = require('moment')
// ModelUn register
const modelUnRegister = async (req, res) => {
  const body =  {
    event_type,
    format,
    event_theme,
    sub_theme,
    last_date,
    date_proposed,
     filteredSelectedCommittee,
     slectedCommittee,
    event_time,
    event_venue,
  } = req.body;

   
    // slectedCommittee,
  const { instituteId } = req.params;
  try {
    const munRegister = await DBMODELS.model_un_register.create({
      ...body,
      instituteId: Number(instituteId),
      
    });

    // console.log("munRegister", munRegister);
    if (munRegister) {
      const registerId = munRegister.id;
      // const createCommittee =
      //   await DBMODELS.model_un_selected_committees.create({
      //     registerId,
      //   });

      let newSelectedCommittee = [];
      if (slectedCommittee) {
        for (let i = 0; i < slectedCommittee.length; i++) {
          const newItem = {
            ...slectedCommittee[i],
            registerId: registerId ? registerId:null,
          };
          newSelectedCommittee.push(newItem);
        }
      }
      const create = await DBMODELS.model_un_selected_committees.bulkCreate(
        newSelectedCommittee
      );
      return res
        .status(201)
        .json({ msg: "ModelUn register successfully", registerDetail:munRegister, create });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};
// get institute registration details
const registrationDetail = async(req,res)=>{
  const {instituteId} = req.params;
  try {
    const eventDetail = await DBMODELS.model_un_register.findOne({
      where:{
        instituteId
      },
      order:[['createdAt', 'DESC']]
    });
    const allCommittee = await DBMODELS.model_un_selected_committees.findAll({
      where:{
        registerId:eventDetail.id,
      }
    })
    return res.status(200).json({
      eventDetail,
      allCommittee
    })
  } catch (error) {
    return res.json(error.message)
  }
}
// check if institute register
const checkIfInstituteRegister = async(req,res)=>{
  const {instituteId} = req.params
  try {
    const check = await DBMODELS.model_un_register.findOne({
      where:{
        instituteId
      }
    })
    if(check){
      return res.json({
        result:true
      })
    }
    else{
      return res.json({
        result:false
      })
    }
    
  } catch (error) {
    return res.json(error.message)
  }
}

// get available postitions by committeeId
const getAvailablePosByComId = async(req,res)=>{
  const {committeeId, registerId} = req.params

  try {
    const commiittee = await DBMODELS.model_un_selected_committees.findOne({
      where:{
        committeeId,
        registerId,
      },attributes:['id', 'slots', 'committeeId']
    })
    
    const getAllParticipates = await DBMODELS.model_un_student_part.count({
      where:{
        model_un_register_id:registerId,
        committeeId,
      }
    })
    const allNominatedStudents = await DBMODELS.model_un_student_part.count({
      where:{
        model_un_register_id:registerId,
        committeeId,
        is_participant:true,
      }
    })
   

    return res.status(200).json({
      allApplicants:getAllParticipates,
      allNominatedStudents,
      commiittee,
      remainingSlots:commiittee.slots-allNominatedStudents
    })

  } catch (error) {
    return res.status(500).json({
      error:error.message
    })
  }
}

const getNominationDetailByStudentPartId = async (req,res)=>{
  const {studentId, registerId}= req.params;
  try {
    const studentDetail = await DBMODELS.model_un_student_part.findOne({
      where:{
        id:studentId,
        model_un_register_id:registerId
      },
      attributes:[
        "id", "studentId", "instituteId", "model_un_register_id", 
        "secretariatType", "nominationType", "pre_register_sec_email", 
        "pre_register_pc_email", "last_registration_date", "pref_country", 
        "pref_role", "pref_designation", "pref_committee", "selectedCommittee", 
        "committeeId", "secretariatsId", "pressCorpsId", "status", "is_participant", "createdAt", "updatedAt",
        [sequelize.literal(`(
          select role
          from students
          where students.id = model_un_student_part.studentId
         )`,),'role'],
         [sequelize.literal(`(
          select concat(first_name,' ',last_name)
          from students
          where students.id = model_un_student_part.studentId
         
        )`),'name']
      ]
    })
    const committeeDetails = await DBMODELS.model_un_committees.findOne({
      where:{
        id:studentDetail.committeeId
      }
    })
    return res.status(200).json({
      studentDetail,committeeDetails
    })
  } catch (error) {
    return res.status(500).json({
      error:error.message
    })
  }
}

// make applicants (student) a nominated
const nominateStudent = async (req, res) => {
  const { studentId, registerId } = req.params;
  const body = req.body
  const { pref_committee, committeeId, secretariatsId, pressCorpsId, pref_designation,secretariatType } = req.body
  const t = await sequelize.transaction();
  try {
    await DBMODELS.model_un_student_part.update({ ...body, committeeId: Number(committeeId), pressCorpsId: Number(pressCorpsId), secretariatsId: Number(secretariatsId),pre_register_sec_email:"", pre_register_pc_email: "" }, {
      where: {
        id: studentId,
        model_un_register_id: registerId,
      }
    },{ transaction: t })
    const studentDetail = await DBMODELS.model_un_student_part.findOne({
      where: {
        id: studentId,
        model_un_register_id: registerId,
      },
      raw: true
    })
    const ApplicantUserDetail = await DBMODELS.students.findOne({
      where: {
        id: studentDetail?.studentId,
      },
      raw: true
    })
    //============= IF  WE ARE UPDATE AN APPLICANT AS A PRESS CORP MEMBER   ==============
    if (pref_committee === "Press Corps") {
      const pressCorpUsersExist = await DBMODELS.model_un_pressCorps_members.findOne({
        where: {
          studentId: studentDetail?.studentId
        },
        raw: true
      })
      if (pressCorpUsersExist) {
        await DBMODELS.model_un_pressCorps_members.update({
          assign_designation: pref_designation
        }, {
          where: {
            id: pressCorpUsersExist?.id
          }
        },{ transaction: t })
        await DBMODELS.model_un_student_part.update({ pre_register_sec_email: "", pre_register_pc_email: ApplicantUserDetail?.email },
          {
            where: {
              id: studentId
            }
          },{ transaction: t })
      } else {
        const createPreCorpuser = await DBMODELS.model_un_pressCorps_members.create({
          studentId: ApplicantUserDetail?.id,
          instituteId: ApplicantUserDetail?.instituteId,
          registerId: registerId,
          name: ApplicantUserDetail?.first_name + " " + ApplicantUserDetail?.last_name,
          email: ApplicantUserDetail?.email,
          role: ApplicantUserDetail?.role,
          phone: ApplicantUserDetail?.contact,
          assign_designation: pref_designation

        },{ transaction: t })
        await DBMODELS.model_un_student_part.update({ pre_register_sec_email: "", pre_register_pc_email: ApplicantUserDetail?.email },
          {
            where: {
              id: studentId
            }
          },{ transaction: t })
        //===== Delete the user from other table ==== 

        await DBMODELS.model_un_secretariats_member.destroy({
          where: {
            studentId: ApplicantUserDetail?.id,
            registerId: registerId,
          }
        },{ transaction: t })

      }
    }else if(["Executive Board","Organisation Committee","Judging and Jury"].includes(secretariatType)){
      // =========== IF WE ARE UPDATE AN APPLICANT AS A SECRETARIAT MEMBER =============\\ 
      const pressCorpUsersExist = await DBMODELS.model_un_secretariats_member.findOne({
        where: {
          studentId: studentDetail?.studentId
        },
        raw: true
      })
      if (pressCorpUsersExist) {
        if(secretariatType==="Organisation Committee"){
          await DBMODELS.model_un_secretariats_member.update({
            assign_designation: pref_designation
          }, {
            where: {
              id: pressCorpUsersExist?.id
            }
          },{ transaction: t })
        }else{
          await DBMODELS.model_un_secretariats_member.update({
            assign_designation: pref_designation,
            selectedCommittee:pref_committee
          }, {
            where: {
              id: pressCorpUsersExist?.id

            }
          },{ transaction: t }) 
        }
        await DBMODELS.model_un_student_part.update({ pre_register_sec_email: ApplicantUserDetail?.email, pre_register_pc_email: "" ,selectedCommittee:secretariatType==="Organisation Committee" ? "" : pref_committee},
          {
            where: {
              id: studentId
            }
          },{ transaction: t })
      } else {
        const createPreCorpuser = await DBMODELS.model_un_secretariats_member.create({
          studentId: ApplicantUserDetail?.id,
          instituteId: ApplicantUserDetail?.instituteId,
          registerId: registerId,
          name: ApplicantUserDetail?.first_name + " " + ApplicantUserDetail?.last_name,
          email: ApplicantUserDetail?.email,
          role: ApplicantUserDetail?.role,
          phone: ApplicantUserDetail?.contact,
          assign_designation: pref_designation,
          selectedCommittee:secretariatType==="Organisation Committee" ? "" : pref_committee
        },{ transaction: t })
        await DBMODELS.model_un_student_part.update({ pre_register_sec_email: ApplicantUserDetail?.email, pre_register_pc_email: "" ,selectedCommittee:secretariatType==="Organisation Committee" ? "" : pref_committee},
          {
            where: {
              id: studentId
            }
          },{ transaction: t })
        //===== Delete the user from other table ==== 

        await DBMODELS.model_un_pressCorps_members.destroy({
          where: {
            studentId: ApplicantUserDetail?.id,
            registerId: registerId,
          }
        },{ transaction: t })

      }
    }else{
      
      await DBMODELS.model_un_pressCorps_members.destroy({
        where: {
          studentId: ApplicantUserDetail?.id,
          registerId: registerId,
        }
      },{ transaction: t })
      await DBMODELS.model_un_secretariats_member.destroy({
        where: {
          studentId: ApplicantUserDetail?.id,
          registerId: registerId,
        }
      },{ transaction: t })
    }
    await t.commit();
    return res.status(200).json({
      studentDetail
    })
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      error: error.message
    })
  }
}

const RejectApplicant =async(req,res)=>{
  const { studentId, registerId } = req.params;
  const {rejectOption, RejectDec,role,instituteId} = req.body
  try {
    let reason_of_reject
    if(rejectOption ==="Any other (Please specify)"){
      reason_of_reject=RejectDec
    }else{
      reason_of_reject=rejectOption
    }
   const rejectUser = await DBMODELS.model_un_student_part.update({reason_of_reject,status:"rejected",nominationType:"pref",is_participant:false  }, {
      where: {
        id: studentId,
        model_un_register_id: registerId,
      }
    })
    let adminDetails;
    if(role ==="institute"){
     adminDetails = await DBMODELS.institutions.findOne({
        where:{
          id:instituteId
        }
      })
    }else{
      adminDetails = await DBMODELS.students.findOne({
        where:{
        instituteId
        }
      })
    }
    if(rejectUser){
      const studentDetail = await DBMODELS.model_un_student_part.findOne({
        where: {
          id: studentId,
          model_un_register_id: registerId,
        },
        raw: true
      })
      const ApplicantUserDetail = await DBMODELS.students.findOne({
        where: {
          id: studentDetail?.studentId,
        },
        raw: true
      })
      const replacements = {
        name: `${ApplicantUserDetail?.first_name} ${ApplicantUserDetail?.last_name}`,
        rejectedBy:`${adminDetails?.first_name} ${adminDetails?.last_name}`,
        reason:reason_of_reject,
        pref_committee:studentDetail?.pref_committee || " ",
        pref_designation:studentDetail?.pref_designation || " ",
        pref_country:studentDetail?.pref_country || " ",
        pref_role:studentDetail?.pref_role || " ",

      };
      let mailConfig = {
        email: ApplicantUserDetail?.email,
        subject: `We regret to inform you that your application has not been selected for participation in this event.`,
      };
      sendEmailService.sendTemplatedEmail(
        mailConfig,
        replacements,
        "Applicant_reject"
      );

    }
return res.json({
  message:"Application rejected successfully."
})
    
  } catch (error) {
    console.log("error",error?.message);
    return res.status(500).json({
      success:false,
      message:error?.message
    })
  }

}

const getAllCommitee = async(req,res)=>{
  
  try {
      const allCommittee= await DBMODELS.model_un_committees.findAll()
      return res.status(200).json({
        result:allCommittee
      })
  } catch (error) {
    return res.json(error.message)
  }
}
const getAllcommittee = async (req, res) => {
  const { committees } = req.body;
  try {
    const getCommittee = await DBMODELS.model_un_committees.findAll({
      committees,
    });
    if (getCommittee) {
      return res
        .status(201)
        .json({ msg: "Created commiittee successfully", getCommittee });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};


const getAllUserInstitute = async(req,res)=>{
  const {instituteId} = req.params;
  try {
    const allUser =  await DBMODELS.students.findAll({
      where:{
        instituteId
      },attributes:[
        'id',
        [sequelize.literal(`(
          select concat(first_name,' ',last_name)
          from dual
         
        )`),'name'],
        'email',
        [sequelize.col('contact'),'phone'],
      'role',
        
        [sequelize.literal(`'Limited Access'`),'typeOfCoordinator'],
        [sequelize.literal(`(
          select mur.id
          from model_un_register as mur
          where students.instituteId = mur.instituteId
          order by mur.id DESC
          LIMIT 1
        )`),'registerId']
      ]
    })
    const register = await DBMODELS.model_un_register.findOne({where:{
      instituteId
    },
    order:[["createdAt","DESC"]]
  })
  const registerId= register.id
    return res.json({
      message:'Success ',
      allUser,
      registerId
    })
  } catch (error) {
    return res.json(error.message)
  }
}


const postCoordinator = async(req,res)=>{
  const data = req.body;

  // const data=  {
  //   studentId,
  //   instituteId,
  //   registerId,
  //   name,
  //   designation,
  //   email,
  //   phone,
  //   typeOfCoordinator,
  // }
  try {
    const addSecMember = await DBMODELS.model_un_coordinators.bulkCreate(data)

    return res.json({
      message:'SuccessFully created',
      result:coord
    })
  } catch (error) {
    return res.json(error.message)
  }
}

const postPressCorpsMember = async(req,res)=>{
  const data =   req.body;
  // const data=  {
  //   studentId,
  //   instituteId,
  //   registerId,
  //   name,
  //   email,
  //   role,
  //   phone,
  // }
  try {
    const PC = await DBMODELS.model_un_pressCorps_members.bulkCreate(data)

    return res.json({
      message:'SuccessFully created',
      result:PC
    })
  } catch (error) {
    return res.json(error.message)
  }
}


const postSecretariats = async(req,res)=>{
  const dataArray = req.body;

  
  try {

  //  const data = {
  //     studentId,
  //     instituteId,
  //     registerId,
  //     name,
  //     assign_designation,
  //     email,
  //     role,
  //     phone,
  //   }
    const Sm = await DBMODELS.model_un_secretariats_member.bulkCreate(dataArray)

    return res.json({
      message:'SuccessFully created',
      result:Sm
    })
  } catch (error) {
    return res.json(error.message)
  }
}

const getUNTeam = async(req,res)=>{
  const {instituteId}= req.params;
  try {
    const allCoord = await DBMODELS.model_un_coordinators.findAll({
      where:{
        instituteId,
      },attributes:[
        [sequelize.literal(`(
          select id
          from students
          where students.id = model_un_coordinators.studentId
         )`,),'id'],
        'name',
        [sequelize.literal(`(
          select role
          from students
          where students.id = model_un_coordinators.studentId
         )`,),'role'],
        [sequelize.literal(`
          'Coordinators'
        `),'type'],
        [sequelize.literal(`(
          select profile
          from students
          where students.id = model_un_coordinators.studentId
         )`,),'img'],
         [sequelize.col('id'),'coordId'],
      ]
    })
    const allPC = await DBMODELS.model_un_pressCorps_members.findAll({
      where:{
        instituteId,
      },attributes:[
        [sequelize.literal(`(
          select id
          from students
          where students.id = model_un_pressCorps_members.studentId
         )`,),'id'],
        'name',
        [sequelize.literal(`(
         select role
         from students
         where students.id = model_un_pressCorps_members.studentId
        )`),'role'],
        [sequelize.literal(`
          'Press Corp'
        `),'type'],
        [sequelize.literal(`(
          select profile
          from students
          where students.id = model_un_pressCorps_members.studentId
         )`,),'img'],
         [sequelize.col('id'),'coordId'],
      ]
    })
    const allSec = await DBMODELS.model_un_secretariats_member.findAll({
      where:{
        instituteId,
      },attributes:[
        'id',
        'name',
        'role',
        [sequelize.literal(`
          'Secretariat'
        `),'type'],
        [sequelize.literal(`(
          select profile
          from students
          where students.id = model_un_secretariats_member.studentId
         )`,),'img'],
         [sequelize.col('id'),'coordId'],
      ]
    })

    return res.json({
      message:"Succesfully get",
      allCoordinators:allCoord,
      allPressCorps:allPC,
      allSecretariats:allSec,
    })
  } catch (error) {
    return res.json(error.message)
  }

}

const deleteMember= async(req,res)=>{
  const {role, id, instituteId}= req.params
  try {
    
    if(role==='teachcerCoord'){
      await DBMODELS.model_un_coordinators.destroy({
        where:{
          id
        }
      })
    }else if(role==='pressCorps'){
      await DBMODELS.model_un_pressCorps_members.destroy({
        where:{
          id
        }
      })
    }else if(role==='secretariats'){
      await DBMODELS.model_un_secretariats_member.destroy({
        where:{
          id
        }
      })
    }

    const allCoord = await DBMODELS.model_un_coordinators.findAll({
      where:{
        instituteId,
      },attributes:[
        [sequelize.literal(`(
          select id
          from students
          where students.id = model_un_coordinators.studentId
         )`,),'id'],
        'name',
        [sequelize.literal(`(
          select role
          from students
          where students.id = model_un_coordinators.studentId
         )`,),'role'],
        [sequelize.literal(`
          'Coordinators'
        `),'type'],
        [sequelize.literal(`(
          select profile
          from students
          where students.id = model_un_coordinators.studentId
         )`,),'img'],
         [sequelize.col('id'),'coordId'],
      ]
    })
    const allPC = await DBMODELS.model_un_pressCorps_members.findAll({
      where:{
        instituteId,
      },attributes:[
        [sequelize.literal(`(
          select id
          from students
          where students.id = model_un_pressCorps_members.studentId
         )`,),'id'],
        'name',
        [sequelize.literal(`(
         select role
         from students
         where students.id = model_un_pressCorps_members.studentId
        )`),'role'],
        [sequelize.literal(`
          'Press Corp'
        `),'type'],
        [sequelize.literal(`(
          select profile
          from students
          where students.id = model_un_pressCorps_members.studentId
         )`,),'img'],
         [sequelize.col('id'),'coordId'],
      ]
    })
    const allSec = await DBMODELS.model_un_secretariats_member.findAll({
      where:{
        instituteId,
      },attributes:[
        [sequelize.literal(`(
          select id
          from students
          where students.id = model_un_secretariats_member.studentId
         )`,),'id'],
        'name',
        [sequelize.literal(`(
          select role
          from students
          where students.id = model_un_secretariats_member.studentId
         )`),'role'],
        [sequelize.literal(`
          'Secretariat'
        `),'type'],
        [sequelize.literal(`(
          select profile
          from students
          where students.id = model_un_secretariats_member.studentId
         )`,),'img'],
         [sequelize.col('id'),'coordId'],
      ]
    })

    return res.json({
      message:"Succesfully get",
      allCoordinators:allCoord,
      allPressCorps:allPC,
      allSecretariats:allSec,
    }) 

  } catch (error) {
    return res.json({error:error.message})
  }
}
// ====================================================================


// eventFoemat
const createEventFormat = async (req, res) => {
  const body = req.body;
  try {
    const createFormat = await DBMODELS.model_un_eventformat.create(body);
    if (createFormat) {
      return res
        .status(201)
        .json({ msg: "Created format successfully", createFormat });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getEventFormat = async (req, res) => {
  try {
    const getAllformat = await DBMODELS.model_un_eventformat.findAll();
    return res
      .status(200)
      .json({ msg: "Get Successfully", result: getAllformat });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// eventTheme
const getEventTheme = async (req, res) => {
  try {
    const getAllTheme = await DBMODELS.model_un_eventtheme.findAll();
    return res
      .status(200)
      .json({ msg: "Get Successfully", result: getAllTheme });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const getSubTheme = async (req, res) => {
  try {
    const getAllSubTheme = await DBMODELS.model_un_subtheme.findAll();

    let addvalue = []
    for(let i=0;i<getAllSubTheme.length;i++){
      let temp = getAllSubTheme[i];
      const value = {
        ...temp,
        value : temp.id
      }
      addvalue.push(value)
    }
    return res
      .status(200)
      .json({ msg: "Get Successfully", result: addvalue });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// createCommittee
const createCommittee = async (req, res) => {
  const { committees } = req.body;
  try {
    const createCommittee = await DBMODELS.model_un_committees.create({
      committees,
    });
    if (createCommittee) {
      return res
        .status(201)
        .json({ msg: "Created commiittee successfully", createCommittee });
    } else {
      return res.status(204).json({ msg: "Fill correct data" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};



// selectedTheme
const createSelectedCommittee = async (req, res) => {
  const body = req.body;
  try {
    const createSelecdCommittee =
      await DBMODELS.model_un_selected_committees.create(body);
    if (createSelecdCommittee) {
      return res
        .status(201)
        .json({
          msg: "Created selected commiittee slot successfully",
          createSelecdCommittee,
        });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const getAllSelectedCommittee = async (req, res) => {
  try {
    const createSelecdCommittee =
      await DBMODELS.model_un_selected_committees.findAll();
    if (createSelecdCommittee) {
      return res
        .status(201)
        .json({
          msg: "Get all selected commiittee successfully",
          createSelecdCommittee,
        });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const createEventCoordinator = async (req, res) => {
  try {
    const eventcoordinators  = req.body;
    const { instituteId } = req.params;
    const munRegister = await DBMODELS.model_un_register.findOne({
      where: {
        instituteId,
      },
    });
    


    if (munRegister) {
      const registerId = munRegister.id;
      if (registerId) {
        const newCoordinators = [];
        // if (eventcoordinators) {
          for (let i = 0; i < eventcoordinators?.length; i++) {
            const newCoodinator = {
              ...eventcoordinators[i],
              registerId: registerId,
            };
            newCoordinators.push(newCoodinator);
          }

          const getAllCoordinator =
            await DBMODELS.model_un_eventcoordinator.bulkCreate(newCoordinators);
          return res.status(201).json({ msg: "create", getAllCoordinator });
        }
      // }
    }
  } catch (error) {
    console.log("error.message", error.message);
    return res.status(500).json({ msg: "server error", error: error.message });
  }
};

const getInstituteDetails = async (req, res) =>{
  try{
    const { instituteId } = req.params;
    const institute = await DBMODELS.institutions.findOne({
      attributes: ['institution_name', 'logo'],
      where: {
        id: instituteId
      }
    })
    const instituteRegisterData = await DBMODELS.model_un_register.findAll({
      where: {
        instituteId: instituteId
      }
    })

const institueAllData = [institute , ...instituteRegisterData];

    return res.status(200).json({
      success:true,
      message:"data fetched successfully",
      data:institueAllData
    })

  }catch(err){
    console.log("error.message", err.message);
    return res.status(500).json({
      success:false,
      message:err.message
    });
  }

}


//add Teacher coordinator ====

const addTeacherCoordinator =async(req,res)=>{
  const data =req.body
 const { studentId,name,designation,email,phone,typeOfCoordinator,
  pref_committee,pref_designation,nominationType,status,instituteId,
  registerId,last_registration_date}  =req.body 
  try {
    const instituteDetails = await DBMODELS.institute_reg_details.findOne({
      where:{
        institute_id:data?.instituteId
      }
    })
    const coord =  await DBMODELS.model_un_coordinators.create({studentId,name,designation,email,phone,typeOfCoordinator,registerId,instituteId})
 ///=========== Setup of  registration link for secretariat member =============\\
 const baseUrl=`${process.env.FRONTEND_URL || "http://localhost:3000/"}registration`;
 const params = {
  registration_type:'url',
  count:4,
  type:'Teacher',
  instituteId:data?.instituteId,
  sid:coord?.id,
  name:coord?.name,
  email:coord?.email,
  phone:coord?.phone,
  managerType:'Teacher Coordinator',
  eventType:'YMUN',
  accessType:coord?.typeOfCoordinator
}
   ////============Link generate =============\\

   const encodedParams = Object.entries(params)
   .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
   .join("&");
 
    const finalUrl = `${baseUrl}?${encodedParams}`;
 ///============Email send service start here=======\\

    if(!coord?.studentId){
      const registrationLink =finalUrl ;
    const replacements = {
      name: `${coord?.name}`,
      institute_name:instituteDetails?.institution_name,
      assign_designation:"Teacher Coordinator",
      role:"Teacher",
      registrationLink,
    };
    let mailConfig = {
      email: coord?.email,
      subject: `Invitation for registration as a ${replacements?.role} in ${instituteDetails?.institution_name} .`,
    };
    // sendEmailService.sendTemplatedEmail(
    //   mailConfig,
    //   replacements,
    //   "Mun_cord_invitation"
    // );
    }else{
      if(coord?.studentId){
        const loginLink = `${process.env.FRONTEND_URL || "http://localhost:3000/"
          }login`;
        const replacements = {
          name: `${coord?.name}`,
          institute_name:instituteDetails?.institution_name,
          assign_designation:"Teacher Coordinator",
          role:"Teacher",
          loginLink,
        };
        let mailConfig = {
          email: coord?.email,
          subject: `Letter of appointment as a ${replacements?.assign_designation} at ${instituteDetails?.institution_name}.`,
        };
        // sendEmailService.sendTemplatedEmail(
        //   mailConfig,
        //   replacements,
        //   "MUN_COORD_APPOINT"
        // );
      }
    }
    return res.json({
      message:'SuccessFully created',
      result:coord
    })
  } catch (error) {
    return  res.status(500).json({
      success:false,
      message:error.message
    });
    
  }
}

// ======Get all teacher coordinator === ===

const getAllTeacherCoordinator = async (req,res) =>{
  const  {instituteId}= req.params
  try {
    const getTeacherCord = await DBMODELS.model_un_coordinators.findAll({
      where:{
        instituteId
      }
    })
    return  res.json({
      message:"All Coordinator found successfully",
      getTeacherCord,
    })
  } catch (error) {
    console.log(error.message)
   return res.status(500).json({
      success:false,
      message:error.message
    });
  }
}

// ======= Delete Teacher coordinator  ===========

const deleteTeacherCord=async(req,res)=>{
  const {email} = req.params
  try {
    const deteleuser = await DBMODELS.model_un_coordinators.destroy({
      where:{
        email
      }
    })
    return res.json({ message: "Teacher coordinator Deleted Successfully." });
  } catch (error) {
    console.log(error.message)
    return  res.status(500).json({
      success:false,
      message:error.message
    });
  }
}
//=============== Get all Secretariat details =============\\
const getAllSecretariat =async(req,res)=>{
  const {registerId,instituteId} = req.params 
 try {
  const countLength = await DBMODELS.model_un_selected_committees.count({
    where :{
      registerId
    }
  })
  const allSec = await DBMODELS.model_un_secretariats.findAll({
    
    attributes:[
      [sequelize.col('id'),'value'],
      [sequelize.col('designation'),'role']
      , 'typeName', 
      [
        sequelize.literal(`CASE 
          WHEN typeName <> 'Organisation Committee' THEN slots * ${countLength}
          ELSE slots
        END`),
        'slots',
      ],
      [
        sequelize.literal(`(
          SELECT COUNT(*)
          FROM model_un_student_part AS sp
          WHERE 
            sp.model_un_register_id = ${registerId}
            AND model_un_secretariats.id = sp.secretariatsId
            AND sp.instituteId = ${instituteId}
            AND status = "approved"
            AND  sp.nominationType IN ('secure', 'manually')
        )`),
        'booked_slots'
      ],
      [
        sequelize.literal(`(
          SELECT COUNT(*)
          FROM model_un_student_part AS sp
          WHERE 
            sp.model_un_register_id = ${registerId}
            AND model_un_secretariats.id = sp.secretariatsId
            AND sp.instituteId = ${instituteId}
            AND pref_committee = "Secretariat"
         
        )`),
        'applicants'
      ],
     
  
  ],
  raw: true
  
  })
  // Use for loop to calculate remaining slots for each entry
  const updatedAllSec = [];
  let totalRemainingSlots = 0;
  for (let i = 0; i < allSec.length; i++) {
    const sec = allSec[i];
    const remainingSlots = sec.slots - sec.booked_slots;
    totalRemainingSlots += remainingSlots;
    updatedAllSec.push({ ...sec, remaining_slots: remainingSlots });
  }
  return res.json({
    message:"data found successfully",
    updatedAllSec, totalRemainingSlots,
  })
 } catch (error) {
  console.log(error.message)
   return res.status(500).json({
    success:false,
    message:error.message
  });
 }
}
//=============== Get all Press Corp details =============\\
const getAllPcData = async (req, res) => {
  const { registerId, instituteId } = req.params;

  try {
    const allSec = await DBMODELS.model_un_pressCorps.findAll({
      attributes: [
        [sequelize.col('id'), 'value'],
        'role',
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM model_un_student_part AS sp
            WHERE 
              sp.model_un_register_id = ${registerId}
              AND model_un_pressCorps.id = sp.pressCorpsId
              AND sp.instituteId = ${instituteId}
              AND pref_committee = "Press Corps"
              AND status = "approved"
              AND nominationType IN ("secure", "manually")
          )`),
          'booked_slots',
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM model_un_student_part AS sp
            WHERE 
              sp.model_un_register_id = ${registerId}
              AND model_un_pressCorps.id = sp.pressCorpsId
              AND sp.instituteId = ${instituteId}
              AND pref_committee = "Press Corps"
          )`),
          'applicants',
        ],
      ],
      raw: true,
    });

    // Calculate total booked slots
    const totalBookedSlots = allSec.reduce((total, entry) => total + entry.booked_slots, 0);

    // Calculate total remaining slots
    const totalAvailableSlots = 10;
    const remainingSlots = totalAvailableSlots - totalBookedSlots;

   

    return res.json({
      message: "Data found successfully",
      allSec,
      remaining_slots: remainingSlots,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success:false,
      message:error.message
    });
  }
};


// ======== Post  Secretariat details by institute in model_un_secretariats and model_un_students_part table =======\\

const addSecretariatDetails=async(req,res)=>{
  const {instituteId,registerId,studentId,name,selectedCommittee,email,phone,pref_committee,secretariatType,secretariatsId,assign_designation,nominationType,status,role,last_registration_date}=req.body;
  try {
    const checkEmailExist = await DBMODELS.model_un_secretariats_member.findOne({
      where:{
        email
      }
    })
    if(checkEmailExist){
      return res.status(409).json({ message: 'Email already exists' });
    }
    const instituteDetails = await DBMODELS.institute_reg_details.findOne({
      where:{
        institute_id:instituteId
      }
    })
    // const formattedPhone = String(phone);
    // console.log("formattedPhone",phone)
    const addSecMember = await DBMODELS.model_un_secretariats_member.create({
       instituteId,
       registerId,
       studentId:studentId ,
       name,
       assign_designation,
       email,
       phone, 
       role,
       selectedCommittee,
    })
    // console.log('phonnnneeee', addSecMember?.phone)
    await DBMODELS.model_un_student_part.create({
      instituteId,
      studentId:studentId ,
      model_un_register_id:registerId,
      pref_committee,
      pref_designation:assign_designation,
      secretariatType,
      secretariatsId,
      nominationType,
      status,
      selectedCommittee,
      last_registration_date,
      pre_register_sec_email:email
    })
    let registerType ;
    if(role === "student"){
      registerType = "Student"
    }else{
      registerType= "Teacher"
    }
    ///=========== Setup of  registration link for secretariat member =============\\
    const baseUrl=`${process.env.FRONTEND_URL || "http://localhost:3000/"}registration`;
    const params = {
      registration_type:"url",
      count:4,
      type:registerType,
      instituteId:instituteId,
      sid:addSecMember?.id,
      name:addSecMember?.name,
      eventType:'YMUN',
      email:addSecMember?.email,
      phone:addSecMember?.phone,
      managerType:pref_committee,
    }
    ////============Link generate =============\\

    const encodedParams = Object.entries(params)
  .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  .join("&");

   const finalUrl = `${baseUrl}?${encodedParams}`;
///============Email send service start here=======\\

    if(!addSecMember?.studentId){
      const registrationLink =finalUrl;
    const replacements = {
      name: `${addSecMember?.name}`,
      institute_name:instituteDetails?.institution_name,
      assign_designation:addSecMember?.assign_designation,
      pref_committee,
      role:addSecMember?.role,
      registrationLink,
    };
    let mailConfig = {
      email: addSecMember?.email,
      subject: `Exclusive Invitation: Join Yuvamanthan Model United Nations as ${pref_committee} ${addSecMember?.assign_designation} .`,
    };
    sendEmailService.sendTemplatedEmail(
      mailConfig,
      replacements,
      "Mun_cord_invitation"
    );
    }else{
      if(addSecMember?.studentId){
        const loginLink = `${process.env.FRONTEND_URL || "http://localhost:3000/"
          }login`;
        const replacements = {
          name: `${addSecMember?.name}`,
          institute_name:instituteDetails?.institution_name,
          assign_designation:addSecMember?.assign_designation,
          role:addSecMember?.role,
          pref_committee,
          loginLink,
        };
        let mailConfig = {
          email: addSecMember?.email,
          subject: `Exclusive Invitation: Join Yuvamanthan Model United Nations as ${pref_committee} ${addSecMember?.assign_designation} .`,
        };
        sendEmailService.sendTemplatedEmail(
          mailConfig,
          replacements,
          "MUN_COORD_APPOINT"
        );
      }
    }
    res.status(201).json({ message: 'Secretariat member created successfully.', addSecMember });
  } catch (error) {
   return res.status(500).json({
      success:false,
      message:error.message
    });
  }
}

// ====== Get all selected secretariats detail by institute=====\\
const getSelectedSecByIns=async(req,res)=>{
  const {instituteId,registerId} = req.body;
  try {
    const allSelectSec = await DBMODELS.model_un_secretariats_member.findAll({
      where:{
        instituteId,
        registerId
      },
      attributes:[
        "id",
        "studentId",
        "instituteId",
        "registerId",
        "name",
        "assign_designation",
        "email",
        "phone",
        "selectedCommittee",
        "role",
        "createdAt",
        "updatedAt",
        [sequelize.literal(`(
          SELECT secretariatType FROM model_un_student_part
          WHERE model_un_student_part.instituteId = ${instituteId}
          AND model_un_student_part.model_un_register_id = ${registerId}
          AND model_un_student_part.pre_register_sec_email = model_un_secretariats_member.email
          ORDER BY createdAt DESC
          LIMIT 1
      )`), 'secretariatType'],
      [sequelize.literal(`(
        SELECT status FROM model_un_student_part
        WHERE model_un_student_part.instituteId = ${instituteId}
        AND model_un_student_part.model_un_register_id = ${registerId}
        AND model_un_student_part.pre_register_sec_email = model_un_secretariats_member.email
        ORDER BY createdAt DESC
        LIMIT 1
    )`), 'status'],
    [sequelize.literal(`(
      SELECT nominationType FROM model_un_student_part
      WHERE model_un_student_part.instituteId = ${instituteId}
      AND model_un_student_part.model_un_register_id = ${registerId}
      AND model_un_student_part.pre_register_sec_email = model_un_secretariats_member.email
      ORDER BY createdAt DESC
      LIMIT 1
  )`), 'nominationType'],
      
      ]
    })
    return res.json({message:"All Secretariat member found.",allSelectSec})
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    });
  }
}

// const getSelectedSecByIns = async (req, res) => {
//   const { instituteId, registerId } = req.body;
//   try {
//     const allSelectSecstudent = await DBMODELS.model_un_student_part.findAll({
//       where: {
//         instituteId,
//         // registerId
//       },
//     });

//     console.log("allSelectSecstudent", allSelectSecstudent);
//     const modelRegisterIds = allSelectSecstudent.map((ele) => ele.instituteId);
//     console.log("modelRegisterIds", modelRegisterIds);

//     const allSelectSec = await DBMODELS.model_un_secretariats_member.findAll({
//       where: {
//         instituteId: {
//           [Op.in]: modelRegisterIds,
//         },
//         registerId,
//       },
//       attributes: [
//         "id",
//         "studentId",
//         "instituteId",
//         "registerId",
//         "name",
//         "assign_designation",
//         "email",
//         "phone",
//         "role",
//         "createdAt",
//         "updatedAt",
//         [sequelize.literal(`(
//           select secretariatType from model_un_student_part 
//           where model_un_student_part.instituteId = model_un_secretariats_member.instituteId
//           limit 1
//         )`),
//         'secretariatType'],
//       ],
//     });

//     // const allSelectSec = await DBMODELS.model_un_secretariats_member.findAll({
//     //   where:{
//     //     instituteId,
//     //     registerId
//     //   },
//     // })
//     return res.json({ message: "hello run", allSelectSec });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

//===== Delete seleted Secretariats by Institute ======\\ 
const deleteSelectedSec = async(req,res)=>{
  const {email} = req.params
  try {
    const result  = await DBMODELS.model_un_secretariats_member.destroy({
      where:{
        email
      }
    });
    await DBMODELS.model_un_student_part.destroy({
      where:{
        pre_register_sec_email:email
      }
    })
    return res.json({message:"Secretariat member deleted successfully."})
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    });
  }
}

//======== Post  Press corp details by institute in model_un_secretariats and model_un_students_part table =======\\
const addPressCorpDetails=async(req,res)=>{
  const {instituteId,registerId,studentId,name,email,phone,pref_committee,assign_designation,pressCorpsId,nominationType,status,role,last_registration_date,userRole}=req.body;
  try {
    const instituteDetails = await DBMODELS.institute_reg_details.findOne({
      where:{
        institute_id:instituteId
      }
    })
    const addPcMember = await DBMODELS.model_un_pressCorps_members.create({
       instituteId,
       registerId,
       studentId:studentId ,
       name,
       email,
       phone, 
       role,
       assign_designation
    })

    await DBMODELS.model_un_student_part.create({
      instituteId,
      studentId:studentId ,
      model_un_register_id:registerId,
      pref_designation:assign_designation, 
      pref_committee,
      pressCorpsId,
      nominationType,
      status,
      last_registration_date,
      pre_register_pc_email:email
    })
    const baseUrl=`${process.env.FRONTEND_URL || "http://localhost:3000/"}registration`;
   
  const params = {
    registration_type: "url",
    count: 4,
    type: studentId ? userRole : "Student",
    instituteId: instituteId,
    sid:addPcMember?.id,
    name: addPcMember?.name,
    eventType:"YMUN",
    email:addPcMember?.email,
    phone:addPcMember?.phone,
    managerType:pref_committee
    // ... other parameters
  }; 
  const encodedParams = Object.entries(params)
  .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  .join("&");

   const finalUrl = `${baseUrl}?${encodedParams}`;
    if(!addPcMember?.studentId){
      const registrationLink = finalUrl;
    const replacements = {
      name: `${addPcMember?.name}`,
      institute_name:instituteDetails?.institution_name,
      assign_designation:addPcMember?.role,
      role:params?.type ? params?.type :"student",
      registrationLink,
    };
    let mailConfig = {
      email: addPcMember?.email,
      subject: `Invitation for registration as a ${params?.type} in ${instituteDetails?.institution_name} .`,
    };
    // sendEmailService.sendTemplatedEmail(
    //   mailConfig,
    //   replacements,
    //   "Mun_cord_invitation"
    // );
    }else{
      if(addPcMember?.studentId){
        const loginLink = `${process.env.FRONTEND_URL || "http://localhost:3000/"
          }login`;
        const replacements = {
          name: `${addPcMember?.name}`,
          institute_name:instituteDetails?.institution_name,
          assign_designation:addPcMember?.assign_designation,
          role:"student",
          pref_committee,
          loginLink,
        };
        let mailConfig = {
          email: addPcMember?.email,
          subject: `Exclusive Invitation: Join Yuvamanthan Model United Nations as ${pref_committee} ${addPcMember?.assign_designation}.`,
        };
        // sendEmailService.sendTemplatedEmail(
        //   mailConfig,
        //   replacements,
        //   "MUN_COORD_APPOINT"
        // );
      }
    }
    res.status(201).json({ message: 'Secretariat member created successfully.' });
  } catch (error) {
   return res.status(500).json({
      success:false,
      message:error.message
    });
  }
}

// ====== Get all selected Press corps detail by institute=====\\
const getSelectedPcByIns=async(req,res)=>{
  const {instituteId,registerId} = req.params;
  try {
    const allSelectPc = await DBMODELS.model_un_pressCorps_members.findAll({
      where:{
        instituteId,
        registerId
      },
      attributes:[
      "id",
      "studentId",
      "instituteId",
      "registerId",
      "name",
      "assign_designation",
      "email",
      "phone",
      "role",
      "createdAt",
      "updatedAt",
      [sequelize.literal(`(
        SELECT secretariatType FROM model_un_student_part
        WHERE model_un_student_part.instituteId = ${instituteId}
        AND model_un_student_part.model_un_register_id = ${registerId}
        AND model_un_student_part.pre_register_pc_email = model_un_pressCorps_members.email
        ORDER BY createdAt DESC
        LIMIT 1
    )`), 'secretariatType'],
    [sequelize.literal(`(
      SELECT status FROM model_un_student_part
      WHERE model_un_student_part.instituteId = ${instituteId}
      AND model_un_student_part.model_un_register_id = ${registerId}
      AND model_un_student_part.pre_register_pc_email = model_un_pressCorps_members.email
      ORDER BY createdAt DESC
      LIMIT 1
  )`), 'status'],
  [sequelize.literal(`(
    SELECT nominationType FROM model_un_student_part
    WHERE model_un_student_part.instituteId = ${instituteId}
    AND model_un_student_part.model_un_register_id = ${registerId}
    AND model_un_student_part.pre_register_pc_email = model_un_pressCorps_members.email
    ORDER BY createdAt DESC
    LIMIT 1
)`), 'nominationType'],
    
    ]
    })
    return res.json({message:"Selected Press corp found.",allSelectPc})
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    });
  }
}
//===== Delete seleted Press corp by Institute ======\\ 
const deleteSelectedPc = async(req,res)=>{
  const {email} = req.params
  try {
    const result  = await DBMODELS.model_un_pressCorps_members.destroy({
      where:{
        email
      }
    });
    await DBMODELS.model_un_student_part.destroy({
      where:{
        pre_register_pc_email:email
      }
    })
    return res.json({message:"Secretariat member deleted successfully."})
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    });
  }
}
//======== A function for send emai which candidate who is not register ==============\\

const editSecretriat = async (req, res)=>{
  const {secretariatId} = req.params;
  const body = req.body;
  try {
    const editSec = await DBMODELS.model_un_secretariats_member.update(body, {
      where: {
        id: secretariatId,
      },
    });
    const editStudentpart = await DBMODELS.model_un_student_part.update(
      {
        pref_role: body?.assign_designation,
        secretariatsId: body?.secretariatsId,
        selectedCommittee: body?.selectedCommittee,
      },
      {
        where: {
          pre_register_sec_email: body?.email,
          instituteId: body?.instituteId,
          model_un_register_id: body?.registerId,
        },
      }
    );

    if (editSec) {
      return res.status(200).json({ msg: "Successfully edit", editSec, editStudentpart });
    } 
    else{
      return res.status(200).json({msg: "not found "})
    }
  } catch (error) {
    return res.status(500).json({msg: "Server Error", error:error?.message})
  }
}

//======Two days before Reminder function for sending email to a person who is not registered with the institute that assigned the designation of Secretariat ===== \\
const notRegisterUSerSendMail = async(req,res) =>{
 
  try {
    const latestRecords = await  sequelize.query(`
    SELECT id, last_date, instituteId
    FROM model_un_register
    WHERE (instituteId, createdAt) IN (
      SELECT instituteId, MAX(createdAt) AS maxCreatedAt
      FROM model_un_register
      GROUP BY instituteId
    );
  `, {
    type: sequelize.QueryTypes.SELECT,
    raw: true,
  });
    // Extract instituteId from MunRegDetails
    const instituteIds = latestRecords.map((detail) => detail.instituteId);
    // Find student emails from students table based on instituteId
    const students = await DBMODELS.students.findAll({
      where: {
        instituteId: instituteIds,
      },
      attributes: ['email','instituteId'],
      raw: true,
    });
    const stuEmail = students.map((student) => student.email);
    const StudInsId = students.map((student) => student.instituteId)
  // console.log("StudInsId==>",StudInsId)
    // Find emails and roles from model_un_secretariats_member table
    const result = await DBMODELS.model_un_secretariats_member.findAll({
      where: {
        [Op.and]:[

          { instituteId: StudInsId },
          { email: { [Op.notIn]: stuEmail } },
        ]
      },
      attributes: ['id','name','email','assign_designation', 'role','registerId','instituteId',
      [
        sequelize.literal(`(
          SELECT last_date
          FROM model_un_register
          WHERE 
            instituteId = model_un_secretariats_member.instituteId   
        )`),
        'last_date',
      ],
      [
        sequelize.literal(`(
          SELECT institution_name
          FROM institutions
          WHERE 
            id= model_un_secretariats_member.instituteId   
        )`),
        'institution_name',
      ],
    ],
      raw: true,
    });
    for (const data of result) {
      const admissionDate = data.last_date;
      const oneDayBefore = moment(admissionDate, 'YYYY-MM-DD').subtract(1, 'day');
      const oneDayBeforeFormatted = oneDayBefore.format('YYYY-MM-DD');
      const currentDate = moment().format('YYYY-MM-DD');
    if ( oneDayBeforeFormatted === currentDate ) {
      
        const registrationLink = `${process.env.FRONTEND_URL || "http://localhost:3000/"}registration?registration_type=url&count=4&type=${data?.role.charAt(0).toUpperCase() + data?.role.slice(1)}&instituteId=${data?.instituteId}&sid=${data?.id}`;
        const replacements = {
          name:data?.name,
          institution_name:data?.institution_name,
          role:data?.role,
          assign_designation:data?.assign_designation,
          last_date:data?.last_date,
          registrationLink,
        };
        let mailConfig = {
          email:data?.email,
          subject: "Request for registration.",
        };
        sendEmailService.sendTemplatedEmail(
          mailConfig,
          replacements,
          "STUDENT_REGISTRATION"
        );
        // console.log("email send",registrationLink)
    }
      
  }
   
  } catch (error) {
    console.log(error.message)
    // return res.json({
    //   message:"server Error",
    //  error: error.message
    // })
  }
}
//======Two days before Reminder function for sending email to a person who is not registered with the institute that assigned the designation of presscorp ===== \\
const notRegisterPressCorpSendMail = async(req,res) =>{
 
  try {
    const latestRecords = await  sequelize.query(`
    SELECT id, last_date, instituteId
    FROM model_un_register
    WHERE (instituteId, createdAt) IN (
      SELECT instituteId, MAX(createdAt) AS maxCreatedAt
      FROM model_un_register
      GROUP BY instituteId
    );
  `, {
    type: sequelize.QueryTypes.SELECT,
    raw: true,
  });
    // Extract instituteId from MunRegDetails
    const instituteIds = latestRecords.map((detail) => detail.instituteId);
    // Find student emails from students table based on instituteId
    const students = await DBMODELS.students.findAll({
      where: {
        instituteId: instituteIds,
      },
      attributes: ['email','instituteId'],
      raw: true,
    });
    const stuEmail = students.map((student) => student.email);
    const StudInsId = students.map((student) => student.instituteId)
  // console.log("StudInsId==>",StudInsId)
    // Find emails and roles from model_un_secretariats_member table
    const result = await DBMODELS.model_un_pressCorps_members.findAll({
      where: {
        [Op.and]:[

          { instituteId: StudInsId },
          { email: { [Op.notIn]: stuEmail } },
        ]
      },
      attributes: ['id','name','email', 'role','registerId','instituteId',
      [
        sequelize.literal(`(
          SELECT last_date
          FROM model_un_register
          WHERE 
            instituteId = model_un_pressCorps_members.instituteId   
        )`),
        'last_date',
      ],
      [
        sequelize.literal(`(
          SELECT institution_name
          FROM institutions
          WHERE 
            id= model_un_pressCorps_members.instituteId   
        )`),
        'institution_name',
      ],
    ],
      raw: true,
    });
    for (const data of result) {
      const admissionDate = data.last_date;
      const oneDayBefore = moment(admissionDate, 'YYYY-MM-DD').subtract(1, 'day');
      const oneDayBeforeFormatted = oneDayBefore.format('YYYY-MM-DD');
      const currentDate = moment().format('YYYY-MM-DD');
    if ( oneDayBeforeFormatted === currentDate ) {
          const registrationLink = `${process.env.FRONTEND_URL || "http://localhost:3000/"}registration?registration_type=url&count=4&type=Student&instituteId=${data?.instituteId}&sid=${data?.id}`;
        const replacements = {
          name:data?.name,
          institution_name:data?.institution_name,
          role:"Student",
          assign_designation:data?.role,
          last_date:data?.last_date,
          registrationLink,
        };
        let mailConfig = {
          email:data?.email,
          subject: "Request for registration.",
        };
        sendEmailService.sendTemplatedEmail(
          mailConfig,
          replacements,
          "STUDENT_REGISTRATION"
        );

    }
      
  }
   
  } catch (error) {
    console.log(error.message)
    // return res.json({
    //   message:"server Error",
    //  error: error.message
    // })
  }
}

//======A function for send email for find Available slot  for nomination =======\\
const getAllInstituteReaminingSlots = async(req,res) =>{
  try {
    const MunRegList = await DBMODELS.model_un_register.findAll({
      attributes:[
        'id','last_date','instituteId',
        [sequelize.literal(`(select email from institutions where institutions.id = model_un_register.instituteId)`),'email'],
        [sequelize.literal(`(select institution_name from institutions where institutions.id = model_un_register.instituteId)`),'institute_name'],
        [sequelize.literal(`(select first_name from institutions where institutions.id = model_un_register.instituteId)`),'first_name'],  [sequelize.literal(`(select last_name from institutions where institutions.id = model_un_register.instituteId)`),'last_name']
      ],
      raw: true,
    });
// console.log("datat-====>",MunRegList)

    await Promise.all(
      MunRegList.map(async (registration) => {
        
        const [slotTotalCount, slotTotalFind,secTotalSlot,booksec] = await Promise.all([
          DBMODELS.model_un_selected_committees.sum('slots', {
            where: { registerId: registration.id },
          }),
          DBMODELS.model_un_selected_committees.findAll({
            where: { registerId: registration.id },
            attributes: [
              [
                sequelize.literal(`(
                  SELECT COUNT(*)
                  FROM model_un_student_part
                  WHERE 
                  model_un_student_part.committeeId = model_un_selected_committees.committeeId
                    AND status = "approved"
                    AND nominationType IN ("secure", "manually")
                    AND model_un_register_id = model_un_selected_committees.registerId
                )`),
                'booked_slots',
              ],
              'registerId',
            ],
            raw: true,
          }),
          DBMODELS.model_un_secretariats.sum('slots'),
          DBMODELS.model_un_secretariats.findAll({
           
            attributes: [
              [
                sequelize.literal(`  (
                  SELECT COUNT(*)
                  FROM model_un_student_part
                  WHERE 
                    model_un_register_id = ${registration.id}
                    AND secretariatsId = model_un_secretariats.id
                    AND status = "approved"
                    AND nominationType IN ('secure', 'manually')
                )`),
                'secBooked_slots',
              ],
       
            ],
            raw: true,
          }),
        ]);
       
        const bookedSlotsCount = slotTotalFind.reduce((total, slot) => total + slot.booked_slots, 0);
        const secTotalBook = booksec.reduce((total, slot) => total + slot.secBooked_slots, 0);
        const last_date = moment(registration.last_date).format('YYYY-MM-DD')
        const currentDate = moment().format('YYYY-MM-DD');
        // console.log("slotTotalFind=>",slotTotalFind)
        // console.log(`booked slot ${bookedSlotsCount} of ${slotTotalCount} for this ${registration?.email}`)
        // console.log(`booked slot ${currentDate} of ${last_date} for this ${registration?.email}`)
        // console.log("slot==>",slotTotalCount ===bookedSlotsCount )
        // console.log("date==>",currentDate == last_date )

        if(currentDate == last_date ){
          await DBMODELS.model_un_student_part.update({
            is_participant:true
          },
          {
            where: {
              instituteId: registration.instituteId
            }
          })
        }else{
           if (currentDate == last_date && slotTotalCount !==bookedSlotsCount<15 && secTotalSlot !==secTotalBook <15) {
          const Manage_slotLink = `${process.env.FRONTEND_URL || "http://localhost:3000/"
            }model-un/manage-event`;
          const replacements = {
            name: `${registration?.first_name} ${registration?.last_name}` ,
            Manage_slotLink,
          };
          let mailConfig = {
            email: registration?.email,
            subject: "Request for Slot Manage.",
          };
          sendEmailService.sendTemplatedEmail(
            mailConfig,
            replacements,
            "SLOTS_MANAGEMENT"
          );
          // console.log("this is wrong")
        }
        }
        // result.push({
        //   registerId: registration.id,
        //   bookedSlotsCount: bookedSlotsCount,
        //   totalSlot: slotTotalCount,
        //   totalSec:secTotalSlot,
        //   secTotalBooked:secTotalBook
        // });
      })
    );

    
  } catch (error) {
   console.log("error==>",error.message)
    
  }
}
//================  A function to find event details with  slot ======\\

const getEventDetailsWithSlot = async(req,res) =>{
  const {instituteId} =  req.params
  try {
    const  eventDetails = await DBMODELS.model_un_register.findOne({
      where :{
        instituteId
      }
    })
    //===== Get the all committee which is selected in this  events ========
  const slectedCommittee = await DBMODELS.model_un_selected_committees.findAll(({
    where:{
      registerId: eventDetails.id
    }
  }))
  return res.status(200).json({eventDetails,slectedCommittee})

  } catch (error) {
    return res.status(500).json(error.message)
  }
}

// ============ function to edit data for deatails of model un register =======\\
const EditEventDetailsWithSlots = async (req, res) => {
  const body = {
    event_type,
    format,
    event_theme,
    sub_theme,
    last_date,
    date_proposed,
    slectedCommittee,
    event_time,
    event_venue,
  } = req.body;

  const { instituteId, registerId } = req.params; // Assuming registerId is the ID of the entry you want to update

  try {
    const existingEntry = await DBMODELS.model_un_register.findByPk(registerId);
    if (!existingEntry) {
      console.log("Record not found")
      return res.status(404).json({ msg: "Record not found" });
    }

    await existingEntry.update({
      ...body,
      instituteId: Number(instituteId),
    });
   const allSelectedCommittee = await DBMODELS.model_un_selected_committees.findAll({
    where:{
      registerId:existingEntry.id
    },
    raw:true

   })
   ///======= Find whose committee does noot exist in slectedCommittee for deleting =================\\
   const committeesToDelete = allSelectedCommittee.filter(existingCommittee => {
    return !slectedCommittee.some(updatedCommittee => updatedCommittee.committeeId === existingCommittee.committeeId);
  });

  //============ Delete committees ========================\\
  for (let i = 0; i < committeesToDelete.length; i++) {
    const committee = committeesToDelete[i];
    await DBMODELS.model_un_selected_committees.destroy({
      where: {
        registerId: existingEntry.id,
        committeeId: committee.committeeId,
      },
    });
  }

  //================ Update or create selected committees if provided  ===================\\
  for (let i = 0; i < slectedCommittee.length; i++) {
    const committee = slectedCommittee[i];
    const existingCommittee = await DBMODELS.model_un_selected_committees.findOne({
      where: {
        registerId: existingEntry.id,
        committeeId: committee.committeeId,
      },
    });

    if (existingCommittee) {
      await existingCommittee.update({
        slots: committee.slots,
        // Add other committee properties if needed
      });
    } else {
      //============= Create new committee  =================== \\
      await DBMODELS.model_un_selected_committees.create({
        ...committee,
        registerId: existingEntry.id,
      });
    }
  }
 

    return res.status(200).json({ msg: "ModelUn entry updated successfully", updatedDetail: existingEntry });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const getAllInstituteReaminingSlotsNew = async(req,res) =>{
  const {instituteId,eventId} = req.params
  try {
const munRegisterDetails = await DBMODELS.model_un_register.findOne({
  where:{
    id:eventId,
    instituteId
  },
  attributes:[
    'last_date'
  ],
  raw: true,
}
)
const last_date = moment(munRegisterDetails?.last_date).format('YYYY-MM-DD')
const currentDate = moment().format('YYYY-MM-DD');
if(last_date===currentDate || currentDate >last_date){
  const [studentParticipate] = await DBMODELS.model_un_student_part.update({ is_participant: true }, {
    where: {
      model_un_register_id: eventId,
      instituteId,
      is_participant: false,
      studentId: {
        [Op.not]: null
      }
    }
  })
  if (studentParticipate > 0) {
    return res.json({
      message: "Applicants are now able to participate in the event.",
      studentParticipate
    })
  } else {
    return res.status(409).json({
      message: "All of your applicants have already participated.",
      studentParticipate
    })
  }
}
return res.json({
  message:"Data found.",munRegisterDetails,studentParticipate
})
  } catch (error) {
   console.log("error==>",error.message)
    
  }
}
const getSelectedCommittee = async(req,res)=>{
  const {registerId} = req.params
  try {
    if(!registerId){
      return res.status(404).json({
        success:false,
        message:"Please provide the registerId of mun."
      })
    }
  const checkRegisterId = await DBMODELS.model_un_selected_committees.findOne({
    where:{
      registerId
    }
  })
  if(!checkRegisterId){
    return res.status(404).json({
      success:false,
      message:"Register id does not exist in record."
    })
  }
    const committeeRes = await DBMODELS.model_un_selected_committees.findAll({
      where:{
        registerId
      },
      attributes:[
        [sequelize.col('id'),'value'],
        [sequelize.literal(`(
         select type  from  model_un_committees where id = model_un_selected_committees.committeeId
        )`),'type'],
        "registerId", "committeeId", "committee", "tracks", "slots"
      ]
    })
    return res.status(200).json({
      message:"Record founded.",
      success:true,
      committeeRes
    })
  } catch (error) {
    return res.json({
      message:error.message,
      success:false,

    })
  }
}
// const getDateTwoDaysBefore = () => {
//   const targetDate = new Date('2023-12-31');
//   const twoDaysBefore = new Date(targetDate);
//   twoDaysBefore.setDate(targetDate.getDate() - 3);
//   twoDaysBefore.setHours(11,0, 0, 0);
//   return twoDaysBefore;
// };

// Schedule the cron job
const job = cron.schedule('35 10 * * *', () => {
  const now = new Date();
  if (now.getHours() === 10 && now.getMinutes() ===35 ) {
    notRegisterUSerSendMail()
    job.stop();
  }
});
const pressCorpEmail = cron.schedule('35 10 * * *', () => {
  const now = new Date();
  if (now.getHours() === 10 && now.getMinutes() === 35) {
    notRegisterPressCorpSendMail();
    pressCorpEmail.stop();
  }
});
const nominationJob = cron.schedule('37 10 * * *', () => {
  const now = new Date();
  if (now.getHours() === 10 && now.getMinutes() ===37) {
    // notRegisterUSerSendMail()
      getAllInstituteReaminingSlots().then(() => {
      nominationJob.stop();
    }).catch((error) => {
      console.error("Nomination job error:", error.message);
      nominationJob.stop();
    });
  }
  
});
nominationJob.start();
job.start();
pressCorpEmail.start();

// function myScheduledFunction() {
//   console.log('Executing the function at 11 am!');
//   // Add your code logic here
// }

// function checkAndExecuteFunction() {
//   const now = new Date();
//   const currentHour = now.getHours();
//   const currentMinute = now.getMinutes();

//   if (currentHour === 11 && currentMinute === 26) {
//     myScheduledFunction();
//   } else {
//     console.log('It is not 11 am yet. Current time:', now);
//   }
// }

// // Check and execute the function every minute
// setInterval(checkAndExecuteFunction, 60 * 1000);

//=============== New api for modelun applicant ================\\

const betaCheckApplicantUserList = async(req,res)=>{
  const {instituteId} = req.params
  try {
    const allUser =  await DBMODELS.students.findAll({
      where:{
        instituteId
      },attributes:[
        'id',
        [sequelize.literal(`(
          select concat(first_name,' ',last_name)
          from dual
         
        )`),'name'],
        'email',
        [sequelize.col('contact'),'phone'],
      'role',
      'profile',
      [sequelize.literal(`(
        select msp.id from model_un_student_part as msp where msp.instituteId = ${instituteId} 
        AND msp.studentId = students.id
        order by msp.id DESC
           LIMIT 1
       )`),"applicantId"],
      [sequelize.literal(`(
       select msp.pref_committee from model_un_student_part as msp where msp.instituteId = ${instituteId} 
       AND msp.studentId = students.id
       order by msp.id DESC
          LIMIT 1
      )`),"preferredComm"],
      [sequelize.literal(`(
        select msp.pref_designation from model_un_student_part as msp where msp.instituteId = ${instituteId} 
        AND msp.studentId = students.id
        order by msp.id DESC
           LIMIT 1
        )`),"preferredDesignation"],
        [sequelize.literal(`(
          select msp.pref_role from model_un_student_part as msp where msp.instituteId = ${instituteId} 
          AND msp.studentId = students.id
          order by msp.id DESC
             LIMIT 1
          )`),"preferredRole"],
          [sequelize.literal(`(
            select msp.pref_country from model_un_student_part as msp where msp.instituteId = ${instituteId} 
            AND msp.studentId = students.id
            order by msp.id DESC
               LIMIT 1
            )`),"preferredCountry"],
        ]
    })
    return res.json({
      message:"Data found.",
      allUser
    })
  } catch (error) {
    console.log("Error All user==>",error.message)
    return res.json({
      errro:error?.message
    })
  }
}

const betaFindApplicantTeacher = async(req,res)=>{
  const {instituteId} = req.params
  try {
    const allUser =  await DBMODELS.students.findAll({
      where:{
        instituteId,
        role:"teacher"
      },attributes:[
        [sequelize.col('id'),'value'],
        
        [sequelize.literal(`(
          select concat(first_name,' ',last_name)
          from dual
         
        )`),'name'],
        'email',
        [sequelize.col('contact'),'phone'],
      'role',
      'profile',
      [sequelize.literal(`(
        select msp.id from model_un_student_part as msp where msp.instituteId = ${instituteId} 
        order by msp.id DESC
           LIMIT 1
       )`),"applicantId"],
      [sequelize.literal(`(
       select msp.pref_committee from model_un_student_part as msp where msp.instituteId = ${instituteId} 
       order by msp.id DESC
          LIMIT 1
      )`),"preferredComm"],
      [sequelize.literal(`(
        select msp.pref_designation from model_un_student_part as msp where msp.instituteId = ${instituteId} 
        order by msp.id DESC
           LIMIT 1
        )`),"preferredDesignation"],
        [sequelize.literal(`(
          select msp.pref_role from model_un_student_part as msp where msp.instituteId = ${instituteId} 
          order by msp.id DESC
             LIMIT 1
          )`),"preferredRole"]
        ]
    })
    return res.json({
      message:"Data found.",
      allUser
    })
  } catch (error) {
    console.log("Error All user==>",error.message)
    return res.json({
      errro:error?.message
    })
  }
}


module.exports = {
  deleteMember,
  getUNTeam,
  postSecretariats,
  postPressCorpsMember,
  postCoordinator,
  getAllUserInstitute,
  checkIfInstituteRegister,
  registrationDetail,
  getAllCommitee,
  nominateStudent,
  getNominationDetailByStudentPartId,
  getAvailablePosByComId,
  modelUnRegister,
  createEventFormat,
  getEventFormat,
  getEventTheme,
  getSubTheme,
  createCommittee,
  getAllcommittee,
  createSelectedCommittee,
  getAllSelectedCommittee,
  createEventCoordinator,
  getInstituteDetails,
  addTeacherCoordinator,
  getAllTeacherCoordinator,
  deleteTeacherCord,
  getAllSecretariat,
  getAllPcData,
  addSecretariatDetails,
  getSelectedSecByIns,
  deleteSelectedSec,
  addPressCorpDetails,
  getSelectedPcByIns,
  deleteSelectedPc,
  editSecretriat,
  notRegisterUSerSendMail,
  getAllInstituteReaminingSlotsNew,
  getEventDetailsWithSlot,
  EditEventDetailsWithSlots,
  getSelectedCommittee,
  betaCheckApplicantUserList,
  betaFindApplicantTeacher,
  RejectApplicant,
};
