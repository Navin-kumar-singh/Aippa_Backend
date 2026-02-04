const { uid } = require("uid");
const slugify = require("slugify");
const { InstitutionRegisterSchema, hashingPassword, checkHashedPass } = require("../auth/validation");
const sendEmailService = require("../../service/email");
const logg = require("../../utils/utils");
const { DBMODELS } = require("../../database/models/init-models");
const sequelize = require("../../database/connection");
const { Op, where } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrpyt = require("bcrypt");
const newSlugify = require("../../middleware/newSlugify");


// ----------------INSTITUTE START------------------------------------------

const getVerifyinsPassFill = async (req, res) => {
  const { email } = req.params;
  try {
    const [InsReg, teacherReg, studentReg] = await Promise.all([
      DBMODELS.institute_reg_details.findOne({ where: { email } }),
      DBMODELS.teacher_reg_details.findOne({ where: { email } }),
      DBMODELS.student_reg_details.findOne({ where: { email } })
    ]);

    if (!InsReg && !teacherReg && !studentReg) {
      return res.status(200).json({
        message: "Account Not Exist",
        success: false
      });
    } else {
      return res.status(200).json({
        message: "Account Already Exist. Please Login...",
        success: true
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};
      

//new institute registeration with email and password
const newInstituteRegisterController = async(req,res)=>{
  try {
    
    const {email,password, isNipam} = req.body

    const checkCoord = await DBMODELS.institute_coordinators.findOne({
      where:{
        email
      }
    })
    const checkInstitute = await DBMODELS.institutions.findOne({
      where:{
        email
      }
    })
    const checkStudent = await DBMODELS.students.findOne({
      where:{
        email
      }
    })

    if(!checkCoord && !checkInstitute && !checkStudent){
      let  hashPassword = await hashingPassword(password)
    const saveInstitute = await DBMODELS.institute_reg_details.create({email,password:hashPassword})
      if(isNipam){
        const saveNipamInstitute = await DBMODELS.nipam_institute.create({email})
      }
    if(saveInstitute){
      const verify_token =await jwt.sign(
        {email, type:'institute'},
        process.env.JWT_SECRET,
        { expiresIn: "20m" }
      );
      return res.status(200).json({
        success:true,
        message:'successfully Institute created',
        result:saveInstitute,
        token:verify_token,
        user:{email,
          role:'institute',
          type:1,
          token:verify_token,
          onBoardStatus:false,
          reviewStatus:false
        }
      })
    }
    }else{
      return res.json({
        message:"Account Already Exist"
      })
    }
  } catch (error) {
    return res.status(500).json({
      error:"Internal server error",
      message:error.message
    })
  }
}

// new registeration Intitute
const instituteRegisterationController = async(req,res)=>{

  const {email,isNipam} = req.body
  const type = 'institute'
  console.log("isNipam",isNipam)
  try {
    //check if account already exist

    const checkCoord = await DBMODELS.institute_coordinators.findOne({
      where:{
        email
      }
    })
    const checkInstitute = await DBMODELS.institutions.findOne({
      where:{
        email
      }
    })
    const checkStudent = await DBMODELS.students.findOne({
      where:{
        email
      }
    })

    if(!checkCoord && !checkInstitute && !checkStudent){
      const saveInstitute = await DBMODELS.institute_register.create({
        email,
        isVerified:false
      })
      if(saveInstitute){
        let user = {
          email,
          type:'institute',
          isNipam
          
        }
        const sendVerifyEmail = sendEmailVerificationLink(user);
      
      }
      if (email) {
        if(isNipam){
          var verify_token = jwt.sign({ email, type:"institute",isNipam },process.env.JWT_SECRET,{ expiresIn: "20m" });
        }else{
        var verify_token = jwt.sign({ email, type:"institute" },process.env.JWT_SECRET,{ expiresIn: "20m" });
      }
      }
      return res.json({
        status: "success",
        message: "Registered Successfully",
        token:verify_token,
        email:email,
      });

    }else{
      return res.json({
        message:'Account Already Exist'
      })
    }

  } catch (error) {
    return res.json({
      error:error.message
    })
  }
}


// post institute onboard data

const postInstituteOnBoardData= async(req,res)=>{
  const {institution_name,email,
     type_of_inst,
     type_of_college,
     education_board,
     udise_code,
     medium_of_education,website,
     bio,
     country,state,district,street, city, pinCode,logo,facebook_acc,twitter_acc,
     linkedin_acc,insta_acc,youtube_acc,
     proof_of_id,proof_of_address,first_name,total_teacher,total_student,
     last_name,phone,designation,admin_state,admin_district,
     student_verification,admin_street,admin_city,admin_pincode,account_manager,
    } = req.body
  try {
    let institute_reg_detail = await DBMODELS.institute_reg_details.findOne({
      where:{email}
    })
    let password = institute_reg_detail.password
   let checkNipam = await DBMODELS.nipam_institute.findOne({
    where:{
      email:email
    }
   })
    const saveInstitute = await DBMODELS.institute_reg_details.update({
      institution_name,
      website,
     type_of_inst,
     type_of_college,
     education_board,
     udise_code,
     medium_of_education,
     bio,
     country,state,district,street, city, pinCode,logo,facebook_acc,twitter_acc,
     linkedin_acc,insta_acc,youtube_acc,
     proof_of_id,proof_of_address,first_name,
     last_name,phone,designation,admin_state,admin_district,total_teacher,total_student,
     student_verification,admin_street,admin_city,admin_pincode,
     on_board_status:true
    },{where:{email}})

    // if successfully onboard convert this to proper institute

    if(saveInstitute){

      const createInstitute = await DBMODELS.institutions.create({
        first_name,
        last_name,
        institution_name,
        state,
        pincode:pinCode,
        email,
        bio,
        district,
        contact:phone,
        fb:facebook_acc || "",
        insta:insta_acc || "",
        lkd:linkedin_acc || "",
        twitter:twitter_acc || "",
        ytb:youtube_acc || "",
        password,
        slug: newSlugify(institution_name),
        logo,
        status:'active',
        type:1,
        // institution_address:`street,",",city,",", pinCode,",", country`,
        institution_address:`${street} , ${city},${district} ${pinCode}, ${country}`,
        total_teacher,
        total_student

      })
  
      if(createInstitute){
        // console.log('institute address', createInstitute?.dataValues)
        await DBMODELS.institute_reg_details.update({
          institute_id:createInstitute?.id
        },{where:{email}})
        
        const currentInstCount = await DBMODELS.institute_reg_details.count()
        let institute_count = 3000 + currentInstCount
      
          const replacements = {
            institute_count,
            name: `${first_name} ${last_name}`,            
          };
          let mailConfig = {
            email: email,
            subject: `Yuvamanthan welcomes ${institution_name} .`,
          };
   let templateName = checkNipam ? "Nipam_Welcome" : "Institute_Welcome";
   sendEmailService.sendTemplatedEmail(mailConfig, replacements, templateName);


        const verify_token =await jwt.sign(
          {
            data:{
              id:createInstitute?.dataValues?.id, role:'institute', type:1,institution_name, institution_address:`${street} , ${city},${district} ${pinCode}, ${country}`
            }
          },
          process.env.JWT_SECRET,
          { expiresIn: 60 * 60 * 24 * 20 }
          );
         
        const accountManagerData = account_manager?.map((i)=>{
          return {
            name:i.name,
            email:i.email,
            phone:i.phone,
            designation:i.designation,
            instituteId:createInstitute?.id,
            type_of_manager:i.typeOfManager,
          }
        })
        const createAccountManager = await DBMODELS.institute_account_manager.bulkCreate(accountManagerData)
     
        createAccountManager?.map((item)=>{
        //=========== Setup of  registration link for secretariat member =============\\
      const baseUrl=`${process.env.FRONTEND_URL || "http://localhost:3000/"}registration`;
      const params = {
        registration_type:'url',
        count:4,
        type:'Teacher',
        instituteId:item?.dataValues?.instituteId,
        managerType:item?.dataValues?.type_of_manager,
        sid:item?.dataValues?.id,
        name: item?.dataValues?.name,
        email: item?.dataValues?.email,
        phone: item?.dataValues?.phone
      }
          ////============Link generate =============\\

          const encodedParams = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join("&");

          const finalUrl = `${baseUrl}?${encodedParams}`;
          ///============Email send service start here=======\\

          if(item?.dataValues?.email){
            const registrationLink = finalUrl;
          const replacements = {
            name: `${item?.dataValues?.name}`,
            institute_name:institution_name,
            assign_designation:item?.dataValues?.type_of_manager,
            role:item?.dataValues?.designation,
            pickedBy:`${first_name} ${last_name}`,
            registrationLink,
            baseUrl
          };
          let mailConfig = {
            email: item?.dataValues?.email,
            subject: `You have been appointed as ${item?.dataValues?.type_of_manager} on Yuvamanthan!.`,
          };
          sendEmailService.sendTemplatedEmail(
            mailConfig,
            replacements,
            "Institute_Acc_manager"
          );
          }
        })

        const nipamEmailCheck = await DBMODELS.nipam_institute.count({
          where: {
            email
          }
        })
        
        return res.status(200).json({
          success:true,
          message:'successfully Institute created',
          result:saveInstitute,
          token:verify_token,
        
        user:{ id:createInstitute.id, email, first_name, last_name, logo,institution_name, student_verification,role:'institute',
            token:verify_token, onBoardStatus:true, reviewStatus:false, type:1, nipamCheck: nipamEmailCheck
          }
        })
      }
    }
    
  } catch (error) {

    return res.status(500).json({
      error:error.message
    })
  }
}

const autoSaveInstitute = async(req,res)=>{
  const {id} = req.params
  const data = {
    institution_name,email,
     type_of_inst,
     type_of_college,
     education_board,
     udise_code,
     medium_of_education,website,
     bio,
     country,state,street, city, pinCode,logo,facebook_acc,twitter_acc,
     linkedin_acc,insta_acc,youtube_acc,
     proof_of_id,proof_of_address,first_name,
     last_name,phone,designation,admin_state,
     student_verification,admin_street,admin_city,admin_pincode,account_manager,
  } = req.body;
  try {
    const updatedData = await DBMODELS.institute_reg_details.update(data,
      {
        where:{
          email:id
        }
      })
      const instituteDetail = await DBMODELS.institute_reg_details.findOne({
        where:{
          email:id
        }
      })
    return res.json({message:'success', updatedData, instituteDetail})

  } catch (error) {
    return res.json({error:error.message})
  }
}
 
const getAutoSaveData = async(req,res)=>{
  const {id} = req.params
  try {
    const instituteData = await DBMODELS.institute_reg_details.findOne({
      where:{
        email:id
      }
    })

    return res.json({instituteData})
  } catch (error) {
    return res.json({error:error.message})
  }
}

const checkUnderReviewStatus = async(req,res)=>{
  const {email} = req.params;
  try {
    const institute = await DBMODELS.institute_reg_details.findOne({
      where:{
        email
      }
    })
    if(institute){
      return res.status(200).json({
        result:institute.is_account_verified,
      })
    }
    return res.status(404).json({
      result:false
    })
  } catch (error) {
    return res.status(500).json({
      error:error.message
    })
  }
}

const transferInstitute = async(req,res)=>{
  const {email} = req.body;

  try {
    const institute_details = await DBMODELS.institute_reg_details.findOne({
      where:{
        email
      }
    })

    if(institute_details){
      const {first_name,
        last_name,
        institution_name,
        state,
        pinCode,
        email,
        password,
        logo,
        student_verification,
      } = institute_details
  
      const data = {
        first_name,
        last_name,
        institution_name,
        state,
        pinCode,
        email,
        password,
        slug: newSlugify(institution_name),
        logo,
        status:'active',
        type:1,
      }
      const saveInstitute = await DBMODELS.institutions.create(data);
      if(saveInstitute){
        const verify_token = jwt.sign(
          { email, type:'institute', name:first_name+" "+last_name },
          process.env.JWT_SECRET,
          { expiresIn: "20m" }
        );
        return res.status(200).json({
          success:true,
          message:"successfully created institute main",
          token:verify_token,
          user:{email,
             first_name,
             last_name,
              institution_name,
             student_verification,
             role:'institute',
              logo,type:1,
              id:saveInstitute.id,
          token:verify_token
        }

        })
      }

    }
    
  } catch (error) {
    return res.status(500).json({
      error:error.message
    })
  }
}
const checkEmailVerification  = async(req,res)=>{
  const {email} = req.body;

  try {
    const isVerified = await DBMODELS.institute_register.findOne({
      where:{
        email,
        isVerified:true,
      }
    })
    if(isVerified){
      return res.json({
        result:true,
        message:"Already Verified"
      })
    }else{
      return res.json({
        result:false,
        message:'Not Verified Yet'
      })
    }
  } catch (error) {
    
  }
}

const verifyingInstitute = async(req,res)=>{
  const {email} = req.body;

  try {
    const institute = await DBMODELS.institute_register.update({isVerified:true}, {where:{email}})
    console.log('verified')
    res.status(200).json({
      message:'Successfully Verified'
    })
  } catch (error) {
    res.status(200).json({
      error:error.message
    })
  }
}

//----------------------STUDENT/TEACHER START----------------------------------------



// sending verification mail to student/teacher
const studentRegisterationController = async(req,res)=>{
  const {email, role, instituteId} = req.body
  try {
    console.log('role',role)
    //check if account already exist

    const checkCoord = await DBMODELS.institute_coordinators.findOne({
      where:{
        email
      }
    })
    const checkInstitute = await DBMODELS.institutions.findOne({
      where:{
        email
      }
    })
    const checkStudent = await DBMODELS.students.findOne({
      where:{
        email
      }
    })

    if(!checkCoord && !checkInstitute && !checkStudent){
      const saveUser = role==='student'? await DBMODELS.student_register.create({
        email,
        isVerified:false
      }):await DBMODELS.teacher_register.create({
        email,
        isVerified:false
      })
      if(saveUser){
        let user = {
          email,
          type:role,
          instituteId
        }
        const sendVerifyEmail = sendEmailVerificationLink(user);

      }
      if (email) {
        var verify_token = jwt.sign({ email, type:"student", instituteId },process.env.JWT_SECRET,{ expiresIn: "20m" });
      }
      return res.json({
        status: "success",
        message: "Registered Successfully",
        token:verify_token,
        email:email,
        role,
      });

    }else{
      return res.json({
        message:'Account Already Exist'
      })
    }

  } catch (error) {
    return res.json({
      error:error.message
    })
  }
}
 
// check if student email verified
const checkEmailVerificationStudent  = async(req,res)=>{
  const {email,role} = req.body;
  console.log('role', role)
  try {
    const isVerified =role==='student'? await DBMODELS.student_register.findOne({
      where:{
        email,
        isVerified:true,
      }
    }):await DBMODELS.teacher_register.findOne({
      where:{
        email,
        isVerified:true,
      }
    })
    if(isVerified){
      return res.json({
        result:true,
        message:"Already Verified"
      })
    }else{
      return res.json({
        result:false,
        message:'Not Verified Yet'
      })
    }
  } catch (error) {
    return res.json({error:error.message})
  }
}

// this step is after when the user email is succesfully verified
const newStudentRegister  = async(req,res)=>{
  const {email, password, role,institute_id} = req.body;
  try {
    const checkCoord = await DBMODELS.institute_coordinators.findOne({
      where:{
        email
      }
    })
    const checkInstitute = await DBMODELS.institutions.findOne({
      where:{
        email
      }
    })
    const checkStudent = await DBMODELS.students.findOne({
      where:{
        email
      }
    })
// if not account not exist then proceed
    if(!checkCoord && !checkInstitute && !checkStudent){
      let  hashPassword = await hashingPassword(password)
    const saveUser =role==='student'? await DBMODELS.student_reg_details.create({email,password:hashPassword,institute_id})
                                    :await DBMODELS.teacher_reg_details.create(({email, password:hashPassword,institute_id}))

    if(saveUser){
      const verify_token =await jwt.sign(
        {email, type:role},
        process.env.JWT_SECRET,
        { expiresIn: "20m" }
      );
      return res.status(200).json({
        success:true,
        message:'successfully student created',
        result:saveUser,
        token:verify_token,
        user:{email,
          instituteId:institute_id,
          role:role,
          type:0,
          token:verify_token,
          onBoardStatus:false,
          reviewStatus:false
        }
      })
    }
    }else{
      return res.json({
        message:"Account Already Exist"
      })
    }
    
  } catch (error) {
    return res.json({
      error:error.message
    })
  }
}

const getInstituteDetail = async(req, res)=>{
  const {instituteId} = req.params;
  console.log('instituteId', instituteId)
  try {
    const getInstituteData = await DBMODELS.institutions.findOne({
      where:{
        id: instituteId
      },
      attributes:[
        "id",
        "logo",
        "institution_name",
        [sequelize.literal(`(

              SELECT proof_of_id FROM institute_reg_details 
              where institute_id = ${instituteId}

        )`),"proof_of_id"],
        [sequelize.literal(`(

          SELECT proof_of_address FROM institute_reg_details 
          where institute_id = ${instituteId}

    )`),"proof_of_address"],
        ]
    })
    return res.status(200).json({msg: "Institute data got", getInstituteData})
  } catch (error) {
    return res.status(500).json({msg: "Server error", error: error.message})
  }
}

// student registeration after onboard

const postStudentOnBoardData= async(req,res)=>{

  // taking data from payload
  const data =  {
    id,
    role,
    institution_name,
    institute_id,
    email,
    is_account_verified,
    on_board_status,
    first_name,
    last_name,
    phone,
    profile,
    skills,
    qualification,
    curriculum,
    activities,
    experience,
    achievements,
    website,
    date_of_birth,
    facebook_acc,
    twitter_acc,
    linkedin_acc,
    insta_acc,
    youtube_acc,
    specialization,
    
    } = req.body
  try {
    // find institute for nipam check
    const student_institute = await DBMODELS.institutions.findOne({
      where :{
        id:institute_id
      },attributes:[
        "email"
      ],
      raw:true
    })
    const instDetails = await DBMODELS.institute_reg_details.findOne({
      where :{
     institute_id
      },attributes:[
        "student_verification"
      ],
      raw:true
    })
    
    const nipamCheck = await DBMODELS.nipam_institute.count({
      where :{
        email:student_institute?.email
      }
    })
    
    // find onboard detail and extract password
    const user_detail = data.role==='student'? await DBMODELS.student_reg_details.findOne({
      where:{email}
    })
    : await DBMODELS.teacher_reg_details.findOne({
      where:{email}
    })
    let password = user_detail?.password
   
    // update onboard detail with payload
    const saveUser = data.role==='student'? await DBMODELS.student_reg_details.update({...data,on_board_status:true, password},
      {where:{email}})
      : await DBMODELS.teacher_reg_details.update({...data,on_board_status:true, password},
        {where:{email}})

    // if successfully onboard convert this to proper student
    if(saveUser){
      const userData = {
        first_name,
        last_name,
        instituteId:institute_id,
        email,
        password,
        contact:phone,
        profile,
        status:'active',
        type:0,
        dob:date_of_birth,
        role:data.role,
        address:"India",
        district:"",
        state:"",
        pinCode:"",
        bio: "I have Joined Yuvamanthan ",
        gender:data?.gender,
        fb:data.facebook_acc,
        twitter:data.twitter_acc,
        insta:data.insta_acc,
        lkd:data.linkedin_acc,
        ytb:data.youtube_acc,


        
      }
      // create user in student table
      const createUser = await DBMODELS.students.create(userData)
      // updating student id in onboard detail
      data.role==='student'? await DBMODELS.student_reg_details.update({student_id:createUser.id},
        {where:{email}})
        : await DBMODELS.teacher_reg_details.update({student_id:createUser.id},
          {where:{email}})

          var reviewStatus = true;

          const userInstitute = await DBMODELS.institute_reg_details.findOne({
            where:{
              institute_id:createUser.instituteId
            }
          })
          if(userInstitute?.student_verification===true){
            reviewStatus = false
          }

      if(createUser){
        const verify_token = jwt.sign(
          {email, type:0, name: first_name + " "+ last_name,id:createUser.id,role,institute_id},
          process.env.JWT_SECRET,
          { expiresIn: "20m" }
        );
    
        let userDetails ={id:createUser.id, email, first_name, last_name, institution_name,profile, instituteId:institute_id ,role:data.role,
        token:verify_token, onBoardStatus:true, reviewStatus:reviewStatus, type:0,isModerator:false,nipamCheck:nipamCheck, student_verification:instDetails?.student_verification
      }
      if(data?.role==="teacher"&& ["Moderator","Manager","Admin"].includes(data?.managerType)){  
        const is_update=  await DBMODELS.institute_account_manager.update({studentId:createUser.id,name:first_name + " " + last_name,phone},
          {
          where :{
            email
          }
        })
        if(is_update){
          userDetails= {
            ...userDetails,isModerator:true
          }
        }        
      }else if(data?.role==="teacher"&& data?.managerType==="Teacher Coordinator"){
        const is_update=  await DBMODELS.model_un_coordinators.update({studentId:createUser.id,name:first_name + " " + last_name,phone},
        {
        where :{
          email
        }
      })
      }else if((data?.role==="teacher" || data?.role==="student")&& data?.managerType==="Secretariat"){
        const student_part_update=  await DBMODELS.model_un_student_part.update({studentId:createUser.id},
        {
        where :{
          pre_register_sec_email:email
        }
      })
      const sec_member=  await DBMODELS.model_un_secretariats_member.update({studentId:createUser.id,name:first_name + " " + last_name,phone},
        {
        where :{
         email
        }
      })
      }else{
        if((data?.role==="teacher" || data?.role==="student")&& data?.managerType==="Press Corps"){
          // console.log("data===>",data?.role,data?.role)
          const student_part_update=  await DBMODELS.model_un_student_part.update({studentId:createUser.id,name:first_name + " " + last_name,phone},
            {
            where :{
              pre_register_pc_email:email
            }
          })
          const sec_member=  await DBMODELS.model_un_pressCorps_members.update({studentId:createUser.id,name:first_name + " " + last_name,phone},
            {
            where :{
             email
            }
        })
      }}
        return res.status(200).json({
          success:true,
          message:'successfully student created',
          result:user_detail,
          token:verify_token,
          user:userDetails
        })
      }
    }
    
  } catch (error) {
    return res.status(500).json({
      error:error.message
    })
  }
}

const verifyingUser = async(req,res)=>{
  const {email, role} = req.body;

  try {
    const user =role==='student'? await DBMODELS.student_register.update({isVerified:true}, {where:{email}})
                                  : await DBMODELS.teacher_register.update({isVerified:true}, {where:{email}})
    // console.log('verified')
    res.status(200).json({
      message:'Successfully Verified'
    })
  } catch (error) {
    res.status(200).json({
      error:error.message
    })
  }
}
// check under Review Status
const checkUnderReviewStatusUser = async(req,res)=>{
  const {email, role} = req.params;
  try {
    const user = role==='student'?await DBMODELS.student_reg_details.findOne({
      where:{
        email
      }
    }):
    await DBMODELS.teacher_reg_details.findOne({
      where:{
        email
      }
    })
    if(user){
      return res.status(200).json({
        result:user.is_account_verified,
      })
    }
    return res.status(200).json({
      result:false
    })
  } catch (error) {
    return res.status(500).json({
      error:error.message
    })
  }
}
// ============================================================================


const checkEmailExist = async (req, res) => {
  const { email } = req.body;
  try {
    // Run all queries in parallel
    const [
      checkCoord,
      checkInstitute,
      checkStudent,
      instituteWithoutOnboard,
      studentWithoutOnboard,
      teacherWithoutOnboard,
      adminAccount,
    ] = await Promise.all([
      DBMODELS.institute_coordinators.findOne({ where: { email } }),
      DBMODELS.institutions.findOne({ where: { email } }),
      DBMODELS.students.findOne({ where: { email } }),
      DBMODELS.institute_reg_details.findOne({ where: { email } }),
      DBMODELS.student_reg_details.findOne({ where: { email } }),
      DBMODELS.teacher_reg_details.findOne({ where: { email } }),
      DBMODELS.admin.findOne({ where: { email } }),
    ]);

    // Check if the email exists in any of the results
    if (
      !checkCoord &&
      !checkInstitute &&
      !checkStudent &&
      !instituteWithoutOnboard &&
      !studentWithoutOnboard &&
      !teacherWithoutOnboard &&
      !adminAccount
    ) {
      return res.status(200).json({
        result: false,
        message: 'New Email',
      });
    } else {
      return res.status(200).json({
        result: true,
        message: 'Email Already Exists',
      });
    }
  } catch (error) {
    // Return a 500 status code for server errors
    return res.status(500).json({
      result: false,
      error: error.message,
    });
  }
};

async function sendEmailVerificationLink( user ) {
  try {
    const { email, type, isNipam, instituteId } = user;
    console.log("email", email)
    if (email && type) {
    console.log("email1", email)

      const verify_token = jwt.sign(
        user,
        process.env.JWT_SECRET,
        { expiresIn: "20m" }
      );
      // Send email to user with link to reset password
      const verificationUrl = `${ process.env.FRONTEND_URL || "http://localhost:3000/" }auth/email-verify/${verify_token}`;
      // Send Email
      const replacements = {
        verificationUrl,
      };
      let mailConfig = {
        email,
        subject: "Please verify your email ID for your Yuvamanthan account",
      };
      sendEmailService.sendTemplatedEmail(
        mailConfig,
        replacements,
        "VERIFICATION_EMAIL"
      );
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logg.error(error);
    return false;
  }
}

async function institutionPost(req, res) {
  if (req.file) return res.json({ error: "ERROR", message: "Files are not Supported" });
  
  // validation of data
  const validated = InstitutionRegisterSchema.validate(req.body);
  
  // Validation Error
  if (validated.error) {
    return res.status(400).json({ status: "ERROR", message: validated.error.message });
  }

  try {
    // Find Institutes in DB Model
    const [results, metadata] = await sequelize.query(
      `SELECT email FROM institutions WHERE email='${validated.value.email}' OR contact='${validated.value.contact}'`
    );
    
    if (results.length) {
      return res.status(409).json({ message: "Institute already registered" });
    }

    // Saving Institution
    await DBMODELS.institutions.create({
      title: validated.value.title,
      first_name: validated.value.first_name,
      last_name: validated.value.last_name,
      institution_name: validated.value.institute_name,
      institution_address: validated.value.institute_address,
      state: validated.value.state,
      pincode: validated.value.pincode,
      email: validated.value.email,
      contact: validated.value.contact,
      slug: slugify(validated.value.institute_name + uid(5)),
      status: "pending",
    });

    // Assuming sentOtp function exists
    sentOtp(validated.value.first_name, validated.value.email, (success) => {
      if (success) {
        return res.status(202).json({ message: "OTP sent successfully on your email address" });
      } else {
        return res.status(500).json({ message: "Error While Sending OTP" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error while registering institution", error: error.message });
  }
}

async function verifyOtp(req, res) {
  const { email, otp } = req.body;
  if (email && otp) {
    // verify Status Of Institute
    const instituteStatus = await DBMODELS.institutions.findOne({
      where: {
        email,
      },
    });
    let status = instituteStatus.status;
    switch (status) {
      case "pending":
        DBMODELS.otpverify
          .findOne({
            where: {
              email,
            },
          })
          .then(async (result) => {
            const checkOtp = await checkHashedPass(String(otp), String(result.otp));
            if (checkOtp) {
              const activateInstitute = await DBMODELS.institutions.update(
                {
                  status: "verified",
                },
                {
                  where: {
                    email,
                  },
                }
              );
              let successMessage = `Thank you for your interest in organising Yuvamanthan Model G20 in your institution.We at Yuvamanthan are glad to have ${instituteStatus.institute_name} onboard with us. Please check your email for further details`;
              if (activateInstitute[0]) {
                res.status(200).json({ message: successMessage });
                DBMODELS.otpverify.destroy({
                  where: {
                    email,
                  },
                });
              } else {
                res.status(404).json({ message: "Institute Not Found" });
              }
            } else {
              res.status(400).json({ message: "Incorrect OTP" });
            }
          })
          .catch((error) => {
            logg.error(error);
            res.status(500).json({ message: "Internal Server Error" });
          });
        break;
      case "active":
        res.status(409).json({ message: "Institute is Already Active" });
        break;
      case "verified":
        res.status(409).json({ message: "Institute is Already Verified" });
        break;
      default:
        res.status(404).json({ message: "Institute status not found" });
        break;
    }
    if (status === "pending") {
    } else if (status === "active") {
    }
  } else {
    res.status(404).json({ message: "invalid request" });
  }
}
async function verifierOtp(email, otp, cb) { }

async function sentOtp(name, email, callback) {
  try {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Send email with OTP
    const replacements = {
      name: name,
      otp: otp
    };
    
    const mailConfig = {
      email: email,
      subject: "Your OTP for Yuvamanthan Registration"
    };
    
    // Send email (you might need to adjust this based on your email service)
    await sendEmailService.sendTemplatedEmail(
      mailConfig,
      replacements,
      "OTP_EMAIL" // Make sure you have this template
    );
    
    // Store OTP in database (you need to implement this)
    // await DBMODELS.otp_store.create({ email, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    
    callback(true);
  } catch (error) {
    console.error("Error sending OTP:", error);
    callback(false);
  }
}
//================ get Institute acount manager details by manager id ===========\\
const managerDetailds= async(req,res)=>{
  const {managerId} = req.params
  try {
    const details = await DBMODELS.institute_account_manager.findOne({
      where: {
        id: managerId,
      },
    });


    if (!details) {
      return res.status(404).json({
        message: "User is not found.",
      });
    } else {
      return res.json({
        message: "Data Found.",
        details,
      });
    }
  } catch (error) {
    return res.json({
      message:error.message
    })
  }
  
}
///========== Find subrole  when user is login  ===========\\
const getSubRoles = async(req,res)=>{
  const {email} = req.params
  try {
    const accountManager = await DBMODELS.institute_account_manager.findOne({
      where:{
        email
      },
      attributes:['type_of_manager']
    })
    const coordinator = await DBMODELS.model_un_coordinators.findOne({
      where:{
        email
      },
      attributes:['designation']

    })
    const Secmember = await DBMODELS.model_un_secretariats_member.findOne({
      where:{
        email
      },
      attributes:['role']
    })
    const PcMember = await DBMODELS.model_un_pressCorps_members.findOne({
      where:{
        email
      },
      attributes:['role']
    })
    const roles = [
      accountManager ? accountManager?.type_of_manager : null,//moderator
      coordinator ? coordinator?.designation : null,
      Secmember ? Secmember?.assign_designation : null,
      PcMember ? PcMember?.assign_designation : null // student
    ]
    const existing_role= roles?.filter((i)=>{
      if(i!=null){
        return i
      }
      
    })
   
    return res.status(200).json({
      message:"Data found.",
      roles:existing_role
    })
  } catch (error) {
    return res.status(500).json({
      message:error?.message,
      
    })
  }
}


const updateInsData = async (req, res) => {
  const { instituteId } = req.params;
  const data = req.body;
  try {
    const institution = await DBMODELS.institutions.findOne({
      where: {
        id: instituteId
      }
    });

    if (!institution) {
      // If institution not found, return error
      return res.status(404).json({ error: 'Institution not found' });
    }

    await DBMODELS.institutions.update(data, {
      where: {
        id: instituteId
      }
    });
    await DBMODELS.institute_reg_details.update(data, {
      where: {
        institute_id: instituteId
      }
    });

    const updatedInstitution = await DBMODELS.institutions.findOne({
      where: {
        id: instituteId
      }
    });
    const updatedDataaaa =  await DBMODELS.institute_reg_details.findOne( {
      where: {
        institute_id: instituteId
      }}
    )
    return res.status(200).json({
      message: "The document update has been successfully processed.",
      updatedInstitution,
      updatedDataaaa
    });
  } catch (error) {
    console.error('Error updating institution:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const saveInstituteOnBoardData = async (req, res) => {
  const { email, password, ...updatedFields } = req.body; // Destructure to separate password and other fields

  try {
    const institute = await DBMODELS.institute_reg_details.findOne({ where: { email } });
    if (!institute) {
      return res.json({ message: "Institute does not exist" });
    }

    const update = await DBMODELS.institute_reg_details.update(updatedFields, {
      where: { email }
    });

    if (!update) {
      return res.json({ message: "Institute does not exist" });
    }

    return res.json({ message: "Data saved successfully" });
  } catch (error) {
    return res.json({ error: error.message });
  }
};


const getOnboardingData = async (req, res) => {
  const {email} = req.params
  try {
    
    const onBoardingData = await DBMODELS.institute_reg_details.findOne({
      where:{
        email
      },
      raw:true
    })
    const {password, ...otherData} = onBoardingData
    if(!onBoardingData){
      return res.json({message: "User details not found"})
    }
    return res.json({onBoardingData:otherData})
  } catch (error) {
    return res.json({error:error.message})
  }
}



//=========== A function for save the onboarding data  when user does not complete the onboarding process ============\\  
const saveStudentOnBoardData = async(req,res)=>{
  const { email,type } = req?.params 
  const data = req?.body
  try {
    if (type === "student") {
      await DBMODELS.student_reg_details.update(data, {
        where: {
          email
        }
      });
    } else if (type === "teacher") {
      await DBMODELS.teacher_reg_details.update(data, {
        where: {
          email
        }
      });
    }
    return res.status(200).json({
      message: "Details update has been successfully processed.",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const getStudentOnboardingData = async (req, res) => {
  const {email, type} = req.params
  try {
    let  onBoardingData;
    if(type === "student"){
       onBoardingData = await DBMODELS.student_reg_details.findOne({
        where:{
          email
        },
        raw:true
      })
      const {password, ...otherData} = onBoardingData
      if(!onBoardingData){
        return res.json({message: "User details not found"})
      }
      return res.json({onBoardingData:otherData})
    }else if(type === "teacher"){
       onBoardingData = await DBMODELS.teacher_reg_details.findOne({
        where:{
          email
        },
        raw:true
      })
      const {password, ...otherData} = onBoardingData
      if(!onBoardingData){
        return res.json({message: "User details not found"})
      }
      return res.json({onBoardingData:otherData})
    }
  } catch (error) {
    return res.json({error:error.message})
  }}

module.exports = {
  updateInsData,
  autoSaveInstitute,
  getAutoSaveData,
  checkUnderReviewStatusUser,
  verifyingUser,
  checkEmailVerificationStudent,
  getInstituteDetail,
  postStudentOnBoardData,
  studentRegisterationController,
  newStudentRegister,
  newInstituteRegisterController,
  transferInstitute,
  checkUnderReviewStatus,
  postInstituteOnBoardData, 
  verifyingInstitute,
  checkEmailVerification,
  checkEmailExist,
  instituteRegisterationController,
  institutionPost,
  verifyOtp,
  sentOtp,
  managerDetailds,
  getSubRoles,
  saveInstituteOnBoardData,
  getOnboardingData,
  getVerifyinsPassFill,
  saveStudentOnBoardData,
  getStudentOnboardingData
};