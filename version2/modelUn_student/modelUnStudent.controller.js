const { Op } = require('sequelize');
const sequelize = require("../../database/connection");
const {DBMODELS} = require("../../database/models/init-models");

const studentParticipation = async(req,res)=>{

    const data =  {
        studentId,
        instituteId,
        model_un_register_id,
        committeeId,
        pref_country,
        pref_role,
        pref_committee,
        secretariatsId,
        pressCorpsId,
        selectedCommittee,
        secretarietType,
        pref_designation,
        activeFilter
    } = req.body
    const {email} =req.body
    const t = await sequelize.transaction();
    try {
      const studentDetail= await DBMODELS.students.findOne({
        where:{
            id:studentId
        },
        attributes:[
            "first_name","last_name","email","contact","role"
        ],
        raw:true
      })

      if(activeFilter =="Secretariat"){
        const secMember=  await DBMODELS.model_un_secretariats_member.create({
        studentId,
        instituteId,
        registerId:model_un_register_id,
        name:`${studentDetail?.first_name} ${studentDetail?.last_name}`,
        assign_designation: pref_designation,
        email:studentDetail?.email,
        phone:studentDetail?.contact,
        role:studentDetail?.role,
        selectedCommittee
        }, { transaction: t })
      }

      if(activeFilter =="Press Corps"){
        const pcMember=  await DBMODELS.model_un_pressCorps_members.create({
            studentId,
            instituteId,
            registerId:model_un_register_id,
            name:`${studentDetail?.first_name} ${studentDetail?.last_name}`,
            assign_designation: pref_designation,
            email:studentDetail?.email,
            phone:studentDetail?.contact,
            role:studentDetail?.role,
            }, { transaction: t })
      }
      let participate;
      if(activeFilter =="Secretariat"){
        participate = await DBMODELS.model_un_student_part.create({...data ,committeeId:Number(committeeId),pressCorpsId:Number(pressCorpsId),secretariatsId:Number(secretariatsId),
            pre_register_sec_email:email}, { transaction: t })
      }else if(activeFilter =="Press Corps"){
        participate = await DBMODELS.model_un_student_part.create({...data ,committeeId:Number(committeeId),pressCorpsId:Number(pressCorpsId),secretariatsId:Number(secretariatsId), pre_register_pc_email:email}, { transaction: t })
      }else{
        participate = await DBMODELS.model_un_student_part.create({...data,committeeId:Number(committeeId),pressCorpsId:Number(pressCorpsId),secretariatsId:Number(secretariatsId)}, { transaction: t })
      }
      await t.commit();
    //    console.log("data===>",selectedCommittee,secretarietType,pref_committee)
        return res.json({
            message:'Successfully participated in Model United Nation.',
            result:participate
        })

         
    } catch (error) {
        await t.rollback();
        return res.json({
            message:'Internal Server Error',
            error:error.message
        })
    }
}

const getAllStudentParticipates = async(req,res)=>{
   
    try {
        const allParticipates = await DBMODELS.model_un_student_part.findAll()

        return res.json({
            message:'successfully get all student participates to Model_Un ',
            result:allParticipates
        })

        
    } catch (error) {
        return res.json({
            message:'Internal Server Error',
            error:error.message
        })
    }
}

const getStudentParticipates = async(req,res)=>{
    const {studentId} = req.params;
    try {
        const studentDetail = await DBMODELS.model_un_student_part.findOne({
            where:{
                studentId,
            }
        })
        return res.status(200).json({
            result:studentDetail
        })
    } catch (error) {
        return res.json(error.message)
    }
}


// const getTotalDelegateSlot = async (req, res) => {
//     const { instituteId } = req.params;
//     try {
//         const model_un_reg = await DBMODELS.model_un_register.findOne({
//             where: {
//                 instituteId
//             },
//             attributes: [
//                 'id',
//             ],
//             order: [["createdAt", "DESC"]]

//         })
//         // console.log(model_un_reg,"=====>")

//         const registerId = model_un_reg.id;
//         ///==========Delegate details get============\\

//         const DelegatesDetails = await DBMODELS.model_un_selected_committees.findAll({
//             attributes: [
//                 'committeeId',
//                 'slots',
//             ],
//             where: {
//                 registerId
//             }
//         })
     
//         //========Find selected commiteeId and store in a array ======= \\
//         const committeeIds = [];
//         for (let i = 0; i < DelegatesDetails.length; i++) {
//             committeeIds.push(DelegatesDetails[i].dataValues.committeeId);
//         }
//         //========= Get Total delegates slot ============\\
//         const totalDelegatesSlotsSum = DelegatesDetails.reduce((sum, row) => sum + parseFloat(row.dataValues.slots), 0);

//         //=========Get Total booked slot  based on commitee Id ======\\
//         const totalParticipateSlot = await DBMODELS.model_un_student_part.count({
//             where: {
//                 nominationType:["secure","manually"],    
//                 [Op.and]: [{ model_un_register_id: registerId }, { status: "approved" },
//                 {
//                     [Op.or]: [
//                         { committeeId: committeeIds },
//                     ]
//                 }
//                 ]
//             }
//         });
//         /// ========== Remaining Slot in Delegates =======\\\
//         const remainingDelegatesSlots = totalDelegatesSlotsSum - totalParticipateSlot
      

//         res.json({ remainingDelegatesSlots});
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }

const getAllCommitteeWithApplicants = async(req,res)=>{
    const {instituteId} = req.params
    try {

        const model_un_reg = await DBMODELS.model_un_register.findOne({
            where:{
                instituteId
            },
            attributes:[
                'id',
              ],
              order:[["createdAt","DESC"]]

        })
        // console.log(model_un_reg,"=====>")
        
        const registerId = model_un_reg.id;
        
        const allSelectedCommittee = await DBMODELS.model_un_selected_committees.findAll({
            where:{
                registerId
            },
            attributes:[
                [sequelize.col('id'),'value'],
                'registerId',
                'committeeId',
                [sequelize.col('committee'),'title'],
                'slots',
                'createdAt',
                'updatedAt',
            ]
        })
        // all committeId selected by applicants 
        const allCommitteeIdsByApplicants= await DBMODELS.model_un_student_part.findAll({
            where:{
                model_un_register_id:registerId,
            },
            attributes:[
                'committeeId'
            ]
        })  
        const allCommitteeIdsByParticipants= await DBMODELS.model_un_student_part.findAll({
            where:{
                model_un_register_id:registerId,
                is_participant:true
            },
            attributes:[
                'committeeId'
            ]
        })  
        // creating idcounts object  = { 1:12, 2:12,3:12}
        const idCounts = {};
        for (const idObj of allCommitteeIdsByApplicants) {
            const committeeId = idObj.committeeId;
              idCounts[committeeId] = (idCounts[committeeId] || 0) + 1;
          }

          const assignCommCount = {};
        for (const idObj of allCommitteeIdsByParticipants) {
            const committeeId = idObj.committeeId;
              assignCommCount[committeeId] = (assignCommCount[committeeId] || 0) + 1;
          }
          
          for (const commiittee of allSelectedCommittee) {
             const committee =await DBMODELS.model_un_committees.findOne(({
                where:{
                    id:commiittee.committeeId
                }
             }))
            //  console.log('commitee', committee)
            commiittee.dataValues.type = committee?.type || 'UNDP'
            commiittee.dataValues.applicants = idCounts[commiittee.committeeId] || 0;
            commiittee.dataValues.alreadyTaken = assignCommCount[commiittee.committeeId] || 0;
           
        }
        //   console.log(allSelectedCommittee)
        return res.json({
            message:'successfully get all student participates to Model_Un ',
            allSelectedCommittee,
        })


    } catch (error) {
        return res.json({
            message:'Internal Server Error',
            error:error.message
        })
    }
}
const getAllCommitteeWithApplicantsNew = async(req,res)=>{
    const {instituteId} = req.params
    try {

        const model_un_reg = await DBMODELS.model_un_register.findOne({
            where:{
                instituteId
            },
            attributes:[
                'id',
              ],
              order:[["createdAt","DESC"]]

        })
        // console.log(model_un_reg,"=====>")
        
        const registerId = model_un_reg.id;
        
        const allSelectedCommittee = await DBMODELS.model_un_selected_committees.findAll({
            where:{
                registerId
            },
            attributes:[
                [sequelize.col('id'),'value'],
                'registerId',
                'committeeId',
                [sequelize.col('committee'),'title'],
                'slots',
                'createdAt',
                'updatedAt',
                [
                    sequelize.literal(`(
                      SELECT type
                      FROM model_un_committees
                      WHERE 
                        id = model_un_selected_committees.committeeId    
                    )`),
                    'type',
                  ],
                [
                    sequelize.literal(`(
                      SELECT COUNT(*)
                      FROM model_un_student_part
                      WHERE 
                        committeeId = model_un_selected_committees.committeeId
                        AND model_un_register_id = model_un_selected_committees.registerId
                        AND status = "approved"
                        AND nominationType IN ("secure", "manually")
                    )`),
                    'booked_slots',
                  ],
                  [
                    sequelize.literal(`(
                      SELECT COUNT(*)
                      FROM model_un_student_part
                      WHERE 
                        committeeId = model_un_selected_committees.committeeId
                        AND model_un_register_id = model_un_selected_committees.registerId
                       
                    )`),
                    'applicants',
                  ],
            ],
            raw: true
        })
        // Use for loop to calculate remaining slots for each entry
  const updatedAllDelegate = [];
  let totalRemainingSlots = 0;
  for (let i = 0; i < allSelectedCommittee.length; i++) {
    const delegates = allSelectedCommittee[i];
    const remainingSlots = delegates.slots - delegates.booked_slots;
    totalRemainingSlots += remainingSlots;
    updatedAllDelegate.push({ ...delegates, remaining_slots: remainingSlots });
  }
        return res.json({updatedAllDelegate,totalRemainingSlots})
    }catch(error){
            console.log(error.message)
        }
}
// ======== useLess function ============\\
const getStudentParticipatesByInstituteId = async(req,res)=>{
    const {instituteId} = req.params
    try {
        const studentsParticipants = await DBMODELS.model_un_student_part.findAll({
            where:{
                instituteId,
            }
        })
        // console.log("studentsParticipants", studentsParticipants)
        const studentDetails = []
        for (const studentParticipant of studentsParticipants) {
            const studentId = studentParticipant.studentId;
             // get student details
             const student = await DBMODELS.students.findOne({
                where: {
                    id:studentId,
                }
            });
            console.log('student', studentId)
            // get committee details
            // const committeeDetail = await DBMODELS.model_un_committees.findOne({
            //     where:{
            //         id:studentParticipant?.committeeId,
            //     }
            // })  
            const preferredComm = studentParticipant?.pref_committee
            const preferredCountry = studentParticipant?.pref_country 
            const preferredRole = studentParticipant?.pref_role
            const dateofApplication = studentParticipant?.createdAt
            const avatarUrl = student?.profile
            const status = studentParticipant?.status ||'pending'
           const registerId = studentParticipant?.model_un_register_id
           const committteeId = studentParticipant?.committeeId
           const is_participant=studentParticipant?.is_participant
           const secretariatType= studentParticipant?.secretariatType
            // calculating Year (date of birth)
            const birthdateStr = student?.dob || '2008-06-07'
            const gender = student?.gender || 'Male'
            const birthdate = new Date(birthdateStr);
            const currentDate = new Date();
            const age = currentDate.getFullYear() - birthdate.getFullYear();
            if (
                currentDate.getMonth() < birthdate.getMonth() ||
                (currentDate.getMonth() === birthdate.getMonth() &&
                  currentDate.getDate() < birthdate.getDate())
              ) {
                age--; 
              }


            const studentOldResult = await DBMODELS.student_onboard.findOne({
                where: {
                    studentId,
                }
            });
            // console.log('student.email', student.dataValues)
            let studentNewResult;
           if(student){
             studentNewResult = await DBMODELS.student_reg_details.findOne({
                where: {
                    email:student.email
                }
                
            });
            if(studentOldResult){
                const studentObject = {
                    id:student.id,
                    name: studentOldResult.first_name +' '+studentOldResult.last_name,
                    class: studentOldResult.class,
                    class: studentOldResult.class,
                    age,
                    gender,
                    preferredComm,
                    preferredCountry,
                    preferredRole,
                    dateofApplication,
                    avatarUrl,
                    status,
                    registerId,
                    committteeId,
                    is_participant,
                    secretariatType,
                    
                };
                studentDetails.push(studentObject);
                }
                // new onboarding details
                else if(studentNewResult){
                    
                    const studentObject = {
                        id:student.id,
                        name: studentNewResult.first_name +' '+studentNewResult.last_name,
                        class: studentNewResult.curriculum.course,
                        age,
                        gender,
                        preferredComm,
                        preferredCountry,
                        preferredRole,
                        dateofApplication,
                        avatarUrl,
                        status,
                        registerId,
                        committteeId,
                        is_participant,
                        secretariatType
                    };
                    studentDetails.push(studentObject);
                }
                else {
                    const studentObject = {
                        id:student.id,
                        name: student.first_name +' '+student.last_name,
                        class: 'class',
                        age,
                        gender,
                        preferredComm,
                        preferredCountry,
                        preferredRole,
                        dateofApplication,
                        avatarUrl,
                        status,
                        registerId,
                        committteeId,
                        is_participant,
                        secretariatType,
                    };
                    studentDetails.push(studentObject);
                }
           }
            // old onboarding details
           
        }
        return res.status(200).json({
            result:studentDetails,
        })
    } catch (error) {
        return res.status(200).json({
            error:error.message
        })
    }
}
const getStudentParticipatesByInstituteIdNew = async(req,res)=>{
    const {instituteId} =req.body
    try {
        const allStudent = await DBMODELS.model_un_student_part.findAll({
            where:{
                instituteId
            },
            attributes:[
                [sequelize.literal(`(
                    select id
                    from students
                    where students.id= model_un_student_part.studentId
                )`), 'id'],
                [sequelize.literal(`(
                    select CONCAT(first_name,' ', last_name)
                    from students
                    where students.id = model_un_student_part.studentId
                )`), 'name'],
                [sequelize.literal(`(
                    COALESCE(
                        (
                            select class 
                            from student_onboard
                            where student_onboard.studentId = model_un_student_part.studentId
                        ),
                        (
                            select 
                        )
                    )
                )`), 'class'],
                [sequelize.literal(`(

                )`), 'age'],
                [sequelize.literal(`(

                )`), 'gender'],
                [sequelize.literal(`(
                    s
                )`), 'preferredComm'],
                [sequelize.literal(``), 'preferredCountry'],
                [sequelize.literal(``), 'preferredRole'],
                [sequelize.literal(``), 'dateofApplication'],
                [sequelize.literal(``), 'avatarUrl'],
                [sequelize.literal(``), 'status'],
                [sequelize.literal(``), 'registerId'],
                [sequelize.literal(``), 'committteeId'],
                [sequelize.literal(``), 'is_participant'],
            ]
        })
    } catch (error) {
        
    }
}

//============ get participate details by institute id ====== \\
const getStudentParticipatesNew = async(req,res)=>{
    const {instituteId} = req.params
    try {
        const studentsParticipants = await DBMODELS.model_un_student_part.findAll({
            where:{
                instituteId,
            },
            attributes:[
                'id',
                [
                    sequelize.literal(`
                      COALESCE(
                        (
                          SELECT CONCAT(first_name, ' ', last_name)
                          FROM students
                          WHERE students.id = model_un_student_part.studentId
                        ),
                        (
                          SELECT name
                          FROM model_un_secretariats_member
                          WHERE model_un_student_part.pre_register_sec_email = model_un_secretariats_member.email
                        ),
                        (
                          SELECT name
                          FROM model_un_pressCorps_members
                          WHERE model_un_student_part.pre_register_pc_email = model_un_pressCorps_members.email
                        )
                      )
                    `),
                    'name' // Alias for the attribute
                  ],
                  [sequelize.literal(` 
                  COALESCE(
                    (select role from students where id = model_un_student_part.studentId ),
                    (SELECT role FROM model_un_secretariats_member 
                        WHERE model_un_student_part.pre_register_sec_email = model_un_secretariats_member.email
                      ),
                      ("Student")
                    )
                    `),'role'],
                  [
                    sequelize.literal(`
                      COALESCE(
                        (
                          SELECT contact
                          FROM students
                          WHERE students.id = model_un_student_part.studentId
                        ),
                        (
                          SELECT phone
                          FROM model_un_secretariats_member
                          WHERE model_un_student_part.pre_register_sec_email = model_un_secretariats_member.email
                        ),
                        (
                          SELECT phone
                          FROM model_un_pressCorps_members
                          WHERE model_un_student_part.pre_register_pc_email = model_un_pressCorps_members.email
                        )
                      )
                    `),
                    'contact' // Alias for the attribute
                  ],
                  [
                    sequelize.literal(`
                      COALESCE(
                        (
                          SELECT email
                          FROM students
                          WHERE students.id = model_un_student_part.studentId
                          LIMIT 1
                        ),
                        (
                          SELECT email
                          FROM model_un_secretariats_member
                          WHERE model_un_student_part.model_un_register_id = model_un_secretariats_member.registerId
                          LIMIT 1
                        ),
                        (
                          SELECT email
                          FROM model_un_pressCorps_members
                          WHERE model_un_student_part.model_un_register_id = model_un_pressCorps_members.registerId
                          LIMIT 1
                        )
                      )
                    `),
                    'email' // Alias for the attribute
                  ],
              [sequelize.literal(`(
              select profile
                from students
                where students.id = model_un_student_part.studentId
                LIMIT 1

              )`),'avatarUrl'],
               [sequelize.literal(`(
                    COALESCE(
                        (
                            select class 
                            from student_onboard
                            where student_onboard.studentId = model_un_student_part.studentId
                          LIMIT 1

                        ),
                        (
                            select curriculum from student_reg_details where student_reg_details.student_Id = model_un_student_part.studentId
                          LIMIT 1

                        ),
                        (
                            select qualification from teacher_reg_details where teacher_reg_details.student_id = model_un_student_part.studentId
                          LIMIT 1

                        )
                    )
                )`), 'class'],
             
              [sequelize.literal(`(
                COALESCE(
               (select gender from student_reg_details where student_Id = model_un_student_part.studentId
                LIMIT 1
                
                ),

               (select gender from teacher_reg_details where student_id = model_un_student_part.studentId
                LIMIT 1
                
                )
                 )
              )`),'gender'],
              [sequelize.literal(`(
                select type
                 from model_un_committees
                 where id = model_un_student_part.committeeId
                 LIMIT 1

               )`),'committeeType'],
              [sequelize.literal(`
              COALESCE(
                TIMESTAMPDIFF(YEAR, 
                  (SELECT dob FROM students WHERE students.id = model_un_student_part.studentId), 
                  CURDATE()
                ),
                TIMESTAMPDIFF(YEAR, '1999-01-01', CURDATE())  -- Default age value as of '1999-01-01'
              )
            `), 'age'],
              'committeeId',
              [sequelize.col('model_un_register_id'),'registerId'],
              [sequelize.col('pref_country'),'preferredCountry'],
              [sequelize.col('pref_committee'),'preferredComm'],
              [sequelize.col('createdAt'),'dateofApplication'],
              [sequelize.col('pref_role'),'preferredRole'],
              'studentId',
              'secretariatsId','pressCorpsId','status','nominationType','last_registration_date', 'is_participant',
              'secretariatType',
              'pref_designation',
              'reason_of_reject'
              
            ],
            order:[['createdAt', 'DESC']]
        })
        return res.status(200).json({
        studentsParticipants
        })
    } catch (error) {
        return res.status(500).json({
            error:error.message
        })
    }
}

const getEventDetails = async(req,res)=>{
    const {instituteId} = req.params;
    try {
        const getDetails = await DBMODELS.model_un_register.findOne({
            where:{
                instituteId,
            },
            order: [['createdAt', 'DESC']]
        })
        return res.status(200).json({
            result:getDetails
        })
    } catch (error) {
        return res.status(500).json({
            error:error.message
        })
    }
}
const updateEventDate = async(req,res) =>{
    const {instituteId} = req.params;
    const {formattedDate} = req.body
    try {
        const getDetails = await DBMODELS.model_un_register.update({last_date:formattedDate},{
            where:{
                instituteId,
            },
            
        })
        return res.status(200).json({
            result:getDetails
        })
    } catch (error) {
        return res.status(500).json({
            error:error.message
          })
    }
}
const getPressCorpsDetails = async(req,res)=>{
    const {registerId} = req.params;

    try {
        const roles = await DBMODELS.model_un_pressCorps.findAll()
        const studentsApplicant = await DBMODELS.model_un_student_part.findAll({
            where:{
                model_un_register_id:registerId,
              
            },
            attributes:['pressCorpsId']
        })
        const studentsParticipants = await DBMODELS.model_un_student_part.findAll({
            where:{
                model_un_register_id:registerId,
                is_participant:true
            },
            attributes:['pressCorpsId']
        })
        
        const pressRolesDetails = roles.map((i)=>{
            const applicants = studentsApplicant?.filter((student)=>student?.pressCorpsId==i.id) 
            const idExist = studentsParticipants?.filter((student)=>student?.pressCorpsId==i.id)
             
            return {
                value:i.id,
                isAssigned:idExist.length>0?true:false,
                role:i.role,
                applicants:applicants?.length,
            }
        })
        return res.status(200).json({
            result:pressRolesDetails,
           
        })

    } catch (error) {
        return res.json({error:error.message})
    }
}
const getSecretariotDetails = async(req,res)=>{
    const {registerId} = req.params;

    try {
        const roles = await DBMODELS.model_un_secretariats.findAll()
        const studentsApplicant = await DBMODELS.model_un_student_part.findAll({
            where:{
                model_un_register_id:registerId,
               
            },
            attributes:['secretariatsId']
        })
        const studentsParticipants = await DBMODELS.model_un_student_part.findAll({
            where:{
                model_un_register_id:registerId,
                status:"approved"
            },
            attributes:['secretariatsId']
        })
        
        const pressRolesDetails = roles.map((i)=>{
            const applicants = studentsApplicant?.filter((student)=>student?.secretariatsId==i.id) 
            const idExist = studentsParticipants?.filter((student)=>student?.secretariatsId==i.id)
             
            return {
                value:i.id,
                isAssigned:idExist.length>0?true:false,
                role:i.designation,
                typeName:i.typeName,
                applicants:applicants?.length,
            }
        })
        return res.status(200).json({
            result:pressRolesDetails,
           
        })

    } catch (error) {
        return res.json({error:error.message})
    }
}

//========= Get All Selected candidate behlaf of pref  role===========\\
const getAllSelectCandidateByRole = async (req, res) => {
    const { instituteId } = req.params;
    try {
      const usersWithStudentInfo = await DBMODELS.model_un_student_part.findAll({
        where: {
          instituteId,
          is_participant: true,
          [Op.not]: [
            { pref_committee: ["Secretariat","Press Corps"] },]
        },
        attributes: [
            'pref_committee',
            [sequelize.literal(`(select first_name from students where id = model_un_student_part.studentId)`),'first_name'],
            [sequelize.literal(`(select last_name from students where id = model_un_student_part.studentId)`),'last_name'],
            [sequelize.literal(`(select profile from students where id = model_un_student_part.studentId)`),'profile'],
            [sequelize.literal(`(select role from students where id = model_un_student_part.studentId)`),'role'],
            [
                sequelize.literal(`CAST((
                    SELECT slots
                    FROM model_un_selected_committees
                    WHERE 
                    committeeId =  model_un_student_part.committeeId        
                    AND registerId = model_un_student_part.model_un_register_id
                  ) AS SIGNED)`), 'TotalSlots'
              ],
             
        ],
      });
      // Group data by pref_committee
      const groupedData = usersWithStudentInfo.reduce((acc, user) => {
        const { id, studentId, instituteId,TotalSlots, student_reg_detail, ...userData } = user.toJSON();
        const prefCommittee = userData.pref_committee;
        if (!acc[prefCommittee]) {
          acc[prefCommittee] = { data: [], total: 0, remainingSlots: 0 };
        }
  
        // Include student_reg_details data if available
        const userDetails = {
          studentId,
          ...student_reg_detail ? student_reg_detail.toJSON() : {}, // Check if student_reg_detail is not null
          ...userData,
        };
  
        acc[prefCommittee].data.push(userDetails);
        acc[prefCommittee].total++;
        acc[prefCommittee].remainingSlots =TotalSlots- acc[prefCommittee].total; // Initialize with total
  
        return acc;
      }, {});
        const uniqueCommitteeIds = [];
        Object.values(groupedData).forEach(committeeData => {
            committeeData.data.forEach(user => {
                const { model_un_register_id, pref_committee } = user;
                if (!uniqueCommitteeIds.some(item => item.model_un_register_id === model_un_register_id && item.pref_committee === pref_committee)) {
                    uniqueCommitteeIds.push({ model_un_register_id, pref_committee });
                }
            });
        });
        // Fetch data from the new table
        const committeeSlotsData = await DBMODELS.model_un_selected_committees.findAll({
            where: {
                registerId: { [Op.in]: uniqueCommitteeIds.map(item => item.model_un_register_id) },
                committee: { [Op.in]: uniqueCommitteeIds.map(item => item.pref_committee) },
            },
        });

        committeeSlotsData.forEach((slotData) => {
            const committeeName = slotData?.committee;
            const registerId = slotData?.registerId;
            let slots = slotData?.slots
            if (groupedData[committeeName]) {
                const matchingUser = groupedData[committeeName].data.find(user => user.model_un_register_id === registerId);

                if (matchingUser) {
                    groupedData[committeeName].remainingSlots = slots - groupedData[committeeName].total
                }
            }
        });
  
      res.json(groupedData);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  //=========== Api for getting applicant details to showing on user profile  ========\\
  const getApplicantDetails =async(req,res) =>{
    const {studentId} = req.params
    try {
        const ApplicantsDetails = await DBMODELS.model_un_student_part.findOne({
            where:{
                studentId
            },
            attributes:[
                'id','model_un_register_id','studentId','pref_committee','pref_designation','pref_country','pref_role','status'
            ]
        })

    return res.json({
        message:"Data fetch successfully.",
        ApplicantsDetails 
    })
    } catch (error) {
        return res.json({

            success:false,
            message:error.message
        })
    }

  }
  //=======   Check user is certified in nipam course ===================\\
 const getNipamCertificate =async(req,res) =>{
    const {studentId} = req.params
    try {
        if(studentId ===undefined){
            return res.status(404).json({
                message:"user id is not exist."
            })
        }
        const ApplicantsDetails = await DBMODELS.certificates.findOne({
            where:{
                studentId
            },
        })

    return res.json({
        message:"Data fetch successfully.",
        ApplicantsDetails 
    })
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }

  }


module.exports = {
    getStudentParticipates,
    getSecretariotDetails,
    getPressCorpsDetails,
    getEventDetails,
    // getTotalDelegateSlot,
    updateEventDate,
    getAllCommitteeWithApplicants,
    getAllStudentParticipates,
    studentParticipation,
    getStudentParticipatesByInstituteId,
    getAllSelectCandidateByRole,
    getAllCommitteeWithApplicantsNew,
    getStudentParticipatesNew,
    getApplicantDetails,
    getNipamCertificate
}

