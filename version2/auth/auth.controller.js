const { mysqlcon } = require("../../model/db");
var generator = require("generate-password");
const sendEmailService = require("../../service/email");
const { createJWT, destroyJWT } = require("./jwt");
const { sentOtp } = require("../register/register.controller");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const { registerSchema, hashingPassword, loginSchema, checkHashedPass } = require("./validation");
const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");
const passport = require("passport");

const checkAndReturnUser = async (email) => {
  let user; // Initialize the user variable

  // check if institute exists
  const institute = await DBMODELS.institutions.findOne({
    where: {
      email
    }
  });
  const instituteRegDetail = await DBMODELS.institute_reg_details.findOne({
    where:{
      email
    }
  })

  if (institute) {
    const nipamEmailCheck = await DBMODELS.nipam_institute.count({
      where: {
        email : institute?.email
      }
    })
    
    const {
      id,
      institution_name,
      logo,
      email,
      institution_address,
      
    } = institute;
    

    let newOnboard = await DBMODELS.institute_reg_details.findOne({
      where: {
        email,
      }
    });

    let oldOnboard = await DBMODELS.institute_onboard.findOne({
      where: {
        instituteId: institute.id
      }
    });

    var onBoardStatus = false;
    var reviewStatus = false;

    if (newOnboard) {
      onBoardStatus = newOnboard.on_board_status;
      reviewStatus = newOnboard.is_account_verified;
    } else if (oldOnboard) {
      onBoardStatus = true;
      reviewStatus = true;
    }

    user = {
      id,
      logo,
      institution_name,
      email,
      institution_address,
      type: 1,
      role: 'institute',
      onBoardStatus,
      reviewStatus,
      student_verification:instituteRegDetail ?instituteRegDetail?.student_verification: false,
      nipamCheck: nipamEmailCheck
    };

    return {
      success: true,
      message: 'successfully login in',
      user,
      // jwt: await createJWT(id)
    };
  }

  // login for institute (without onboarding)
  const instituteDirect = await DBMODELS.institute_reg_details.findOne({
    where: {
      email
    }
  });

  if (instituteDirect) {
    const {
      email,
    } = instituteDirect;

    user = {
      email,
      type: 1,
      role: 'institute',
      onBoardStatus: false,
      reviewStatus: false
    };

    return {
      success: true,
      message: 'successfully login in',
      user,
      jwt: await createJWT({
        email,
        role: 'institute',
        type: 1,
      })
    };
  }

  // login for students/teacher
  const userRecord = await DBMODELS.students.findOne({
    where: {
      email,
    },
    attributes: ["id", "first_name", "last_name", "profile", "status", "email", "instituteId", "role", "class"] // FIX: 'class' instead of 'clas'
  });

  if (userRecord) {
    const studentInstituteNipam = await DBMODELS.institutions.findOne({
      where: {
        id: userRecord?.instituteId,
      },
      attributes: ["email"],
    });
    const nipamCheck = await DBMODELS.nipam_institute.count({
      where: {
        email: studentInstituteNipam?.dataValues?.email,
      },
    });
    const {
      id,
      first_name,
      last_name,
      profile,
      status,
      email,
      instituteId,
      role,
      class: studentClass // FIX: Map 'class' to studentClass
    } = userRecord;

    let newOnboard = role === 'student' ? await DBMODELS.student_reg_details.findOne({
      where: {
        email,
      }
    }) : await DBMODELS.teacher_reg_details.findOne({
      where: {
        email,
      }
    });

    let oldOnboard = await DBMODELS.student_onboard.findOne({
      where: {
        studentId: userRecord.id
      }
    });

    var onBoardStatus = false;
    var reviewStatus = false;

    if (newOnboard) {
      onBoardStatus = newOnboard.on_board_status;
      reviewStatus = newOnboard.is_account_verified;
    } else if (oldOnboard) {
      onBoardStatus = true;
      reviewStatus = true;
    }

    const studentInstitute = await DBMODELS.institute_reg_details.findOne({
      where: {
        institute_id: instituteId
      }
    });

    if (studentInstitute) {
      let student_verification = studentInstitute.student_verification;
      if (!student_verification) {
        reviewStatus = true;
      }
    }

    user = {
      id,
      first_name,
      last_name,
      status,
      profile,
      instituteId,
      email,
      role,
      onBoardStatus,
      reviewStatus,
      type: 0,
      clas: studentClass, // FIX: Include class as 'clas' for frontend compatibility
      nipamCheck
    };

    return {
      status: "success",
      success: true,
      message: "Logged in successfully cehckreturnuser 4",
      user,
      jwt: await createJWT({
        id,
        type: 0,
        role,
        instituteId,
        email,
        class: studentClass // FIX: Include class in JWT
      }),
    };
  }

  // user direct login without onboarding and review
  const studentDirect = await DBMODELS.student_reg_details.findOne({
    where: {
      email,
    }
  });

  if (studentDirect) {
    const {
      email,
    } = studentDirect;

    user = {
      email,
      role: 'student',
      onBoardStatus: false,
      reviewStatus: false,
      type: 0,
    };

    return {
      status: "success",
      success: true,
      message: "Logged in successfully checkreturuser3",
      user,
      jwt: await createJWT({
        type: 0,
        role: 'student',
        email,
      }),
    };
  }

  const teacherDirect = await DBMODELS.teacher_reg_details.findOne({
    where: {
      email,
    }
  });

  if (teacherDirect) {
    const {
      email,
    } = teacherDirect;

    user = {
      email,
      role: 'teacher',
      onBoardStatus: false,
      reviewStatus: false,
      type: 0,
    };

    return {
      status: "success",
      success: true,
      message: "Logged in successfull cehckreturnUser2y",
      user,
      jwt: await createJWT({
        type: 0,
        role: 'teacher',
        email,
      }),
    };
  }

  // login for admin
  const admin = await DBMODELS.admin.findOne({
    where: {
      email,
    },
  });

  if (admin) {
    const {
      id,
      first_name,
      last_name,
      profile,
      email,
      role,
    } = admin;

    user = {
      id,
      first_name,
      last_name,
      profile,
      email,
      role,
    };

    return {
      status: "success",
      success: true,
      message: "Logged in successfully checkReturnUser",
      user,
      jwt: await createJWT({
        id,
        role,
        email,
      }),
    };
  }
};

// new login for Yuva 2.0

const newLoginController = async(req,res)=>{
  const {email, password} = req.body;

  try {
    if(email && password){
      //login for institute (with proper onboarding)
      const institute = await DBMODELS.institutions.findOne({
        where:{
          email
        }
      })
      if(institute){
        const nipamEmailCheck = await DBMODELS.nipam_institute.count({
          where: {
            email : institute?.email
          }
        })
        const {
          id,
            institution_name,
            logo,
            email,
            institution_address,
        } =  institute
        let confirmPassword= await checkHashedPass(password, institute.password)
        // console.log("with confirm password", confirmPassword)
        //check onBoardStatus and underReview
        if(confirmPassword){
          let newOnboard = await DBMODELS.institute_reg_details.findOne({
            where:{
             email,
            }
           })
           let oldOnboard = await DBMODELS.institute_onboard.findOne({
             where:{
               instituteId:institute.id
             }
           })
           var onBoardStatus = false
           var reviewStatus = false
           var student_verification= false
           if(newOnboard){
             onBoardStatus = newOnboard.on_board_status
             reviewStatus = newOnboard.is_account_verified
             student_verification = newOnboard.student_verification
           }else if(oldOnboard){
             onBoardStatus = true
             reviewStatus = true
             student_verification= true
           }
           if(confirmPassword){
             let user = {
               id, 
               logo, 
               institution_name,
               email,
               institution_address,
               type:1,
               role:'institute',
               onBoardStatus,
               reviewStatus,
               student_verification,
               nipamCheck: nipamEmailCheck
             };          
             return res.status(200).json({
               success:true,
               message:'succesfully login in ',
               user,
               jwt: await createJWT({
                 id, role:'institute', type:1,institution_name, institution_address
               })
             })
        }
        }
        else{
          return res.json({
            success:false,
            message:'wrong Credential',
          })
        }
      }
       //login for institute (without onboarding)
      const instituteDirect = await DBMODELS.institute_reg_details.findOne({
        where:{
          email
        }
      })
      if(instituteDirect){
        const {
            email,
        } =  instituteDirect
        // console.log("without confirm password")
        let confirmPassword= await checkHashedPass(password, instituteDirect.password)
        
        if(confirmPassword){

          let user = {
            email,
            type:1,
            role:'institute',
            onBoardStatus:false,
            reviewStatus:false
          };
          return res.status(200).json({
            success:true,
            message:'succesfully login in ',
            user,
            jwt: await createJWT({
              email, role:'institute', type:1,
            })
          })
        }
      }
      //login for students/teacher
      const user = await DBMODELS.students.findOne({
        where:{
          email,
        },
        attributes: ["id", "first_name", "last_name", "profile", "status", "email", "instituteId", "role", "class", "password"] // FIX: 'class' instead of 'clas'
      })
      if(user){
        const studentInstituteNipam = await DBMODELS.institutions.findOne({
          where: {
            id: user?.instituteId,
          },
          attributes: ["email"],
        });
        const nipamCheck = await DBMODELS.nipam_institute.count({
          where: {
            email: studentInstituteNipam?.dataValues?.email,
          },
        });
        const {
          id,
          first_name,
          last_name,
          profile,
          status,
          email,
          instituteId,
          role,
          class: studentClass // FIX: Map 'class' to studentClass
        } = user;
        let confirmedPass =  await checkHashedPass(
          password, user.password
        )
         
        //check onBoardStatus and underReview
        
        let newOnboard = role==='student'? await DBMODELS.student_reg_details.findOne({
          where:{
           email,
          }
         })
         :await DBMODELS.teacher_reg_details.findOne({
          where:{
           email,
          }
         })
         let oldOnboard = await DBMODELS.student_onboard.findOne({
           where:{
            studentId:user.id
           }
         })
         var onBoardStatus = false
         var reviewStatus = false
         if(newOnboard){
           onBoardStatus = newOnboard?.on_board_status
           reviewStatus = newOnboard?.is_account_verified
          //  console.log('new onBoard ', reviewStatus)
         }else if(oldOnboard){
           onBoardStatus = true
           reviewStatus = true
          //  console.log('inside old onBoard ', reviewStatus)

         }
          // if institute dont have verification then dont show under review
          const studentInstitute = await DBMODELS.institute_reg_details.findOne({
            where:{
              institute_id:instituteId
            }
          })
          if(studentInstitute){
            let student_verification= studentInstitute?.student_verification
            if(!student_verification){
              reviewStatus = true
          //  console.log('inside studentInstitute ', reviewStatus)

            }
          }
          // console.log('this is review status', reviewStatus)

        if(confirmedPass){
          let user = {
            id,
            first_name,
            last_name,
            status,
            profile,
            instituteId,
            email,
            role,
            onBoardStatus,
            reviewStatus,
            type: 0,
            clas: studentClass, // FIX: Include class as 'clas'
            student_verification: studentInstitute?.student_verification || false,
            nipamCheck
          };
          const accountManager = await DBMODELS.institute_account_manager.findOne({
            where: {
              email,
            },
          });
          if(accountManager){
          const is_update=  await DBMODELS.institute_account_manager.update({studentId:id,name:first_name + " " + last_name},
              {
              where :{
                email
              }
 
            })
            if(is_update){
              user= {
                ...user,isModerator:true
              }
            }
          }
          return res.json({
            status: "success",
            success:true,
            message: "Logged in successfully newLoginContoller",
            user,
            jwt: await createJWT({
              id,
              type: 0,
              role,
              instituteId,
              email,
              class: studentClass // FIX: Include class in JWT
            }),
          });
        }
      }

      // user direct login without onboarding and review
      let studentDirect = await DBMODELS.student_reg_details.findOne({
        where:{
          email,
        }
      })

      // console.log("studentDirect",studentDirect)
      if(studentDirect){
        const {email} = studentDirect;
        let confirmPassword= await checkHashedPass(password, studentDirect.password)
        if(confirmPassword){
          let user = {
            email,
            role:'student',
          //  student_verification :studentInstitute.student_verification,
            onBoardStatus:false,
            reviewStatus:false,
            type: 0,
          };
          return res.json({
            status: "success",
            success:true,
            message: "Logged in successfully newLoginControler2",
            user,
            jwt: await createJWT({
              
              type: 0,
              role:'student',
              email,
            }),
          });
        }
      }
      
        let teacherDirect = await DBMODELS.teacher_reg_details.findOne({
          where:{
            email,
          }
        })

        if(teacherDirect){
          const {email} = teacherDirect;
          let confirmPassword= await checkHashedPass(password, teacherDirect.password)
          if(confirmPassword){
            let user = {
              email,
              role:'teacher',
              onBoardStatus:false,
              reviewStatus:false,
          // student_verification: studentInstitute.student_verification,
              type: 0,
            };
            return res.json({
              status: "success",
              success:true,
              message: "Logged in successfully newLogincontroller3",
              user,
              jwt: await createJWT({
                type: 0,
                role:'teacher',
                email,
              }),
            });
          }
        }

      // login for admin
      const admin = await DBMODELS.admin.findOne({
        where: {
          email,
        },
      });
      if(admin){
        const {
          id,
          first_name,
          last_name,
          profile,
          email,
          role,
        } = admin;
        let confirmedPass =  await checkHashedPass(
          password, admin.password
        )
        if(confirmedPass){
          let user = {
            id,
            first_name,
            last_name,
            profile,
            email,
            role,
            type:2,
          };
          return res.json({
            status: "success",
            success:true,
            message: "Logged in successfully newcontroller3",
            user,
            jwt: await createJWT({
              id,
              role,
              email,
            }),
          });
        }
      }
      
      else{
        return res.json({
          success:false,
          message:'Invalid Credential'
        })
      }
    }else{
      return res.json({
        success:false,
        message:'Invalid Credential'
      })
    }
    
  } catch (error) {
    return res.status(500).json({
      error:error.message
    })
  }
}

const googleLogin = passport.authenticate('google', {scope:['profile', 'email']})

const googleCallback = passport.authenticate('google',{
  failureRedirect:'/',
  successRedirect:'/'
})

async function registerController(req, res) {
  console.log("\n=== REGISTER CONTROLLER STARTED ===");
  console.log("Time:", new Date().toISOString());
  console.log("Query type:", req.query.type);
  
  const { type } = req.query;
  
  if (!type || type !== "0") {
    return res.status(400).json({ 
      success: false, 
      message: "Type parameter must be 0 for student registration" 
    });
  }
  
  if (!req.body) {
    console.log("Request body is undefined");
    return res.status(400).json({
      success: false,
      message: "Request body is required"
    });
  }
  
  console.log("Request body received:", JSON.stringify(req.body, null, 2));
  
  try {
    // TEMPORARY: Add instituteId if missing
    if (req.body.instituteId === undefined) {
      req.body.instituteId = null;
    }
    
    // Validate request body
    console.log("Validating request body...");
    const validation = registerSchema.validate(req.body, { abortEarly: false });
    
    if (validation.error) {
      console.log("Validation errors:", validation.error.details);
      return res.status(400).json({ 
        success: false,
        message: "Validation failed",
        errors: validation.error.details.map(d => d.message)
      });
    }
    
    const data = validation.value;
    console.log("Validation successful!");
    console.log("Validated data:", data);
    
    // Convert date format from DD/MM/YYYY or DD-MM-YYYY to YYYY-MM-DD
    let mysqlDate;
    try {
      console.log("Original date:", data.dob);
      
      // Handle different date formats
      if (data.dob.includes('/')) {
        // Format: DD/MM/YYYY
        const [day, month, year] = data.dob.split('/');
        mysqlDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      } else if (data.dob.includes('-')) {
        // Format: DD-MM-YYYY
        const [day, month, year] = data.dob.split('-');
        mysqlDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      } else {
        // Assume it's already in correct format
        mysqlDate = data.dob;
      }
      
      console.log("Converted MySQL date:", mysqlDate);
      
      // Validate the converted date
      const dateObj = new Date(mysqlDate);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date format");
      }
      
    } catch (dateError) {
      console.error("Date conversion error:", dateError);
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Please use DD/MM/YYYY or DD-MM-YYYY",
        example: "24/11/2001 or 24-11-2001"
      });
    }
    
    // Handle instituteId - make it optional
    let instituteId = null;
    if (data.instituteId && data.instituteId !== '' && data.instituteId !== 'null') {
      instituteId = parseInt(data.instituteId);
      if (isNaN(instituteId)) {
        instituteId = null;
        console.log("Institute ID is not a valid number, setting to null");
      } else {
        console.log("Institute ID provided:", instituteId);
      }
    } else {
      console.log("No instituteId provided, setting to null");
    }
    
    // Check if user already exists
    const checkQuery = "SELECT id FROM students WHERE email = ? OR contact = ?";
    console.log("Checking existing user with email:", data.email);
    
    mysqlcon.query(checkQuery, [data.email, data.contact], async (checkErr, checkResults) => {
      if (checkErr) {
        console.error("Database check error:", checkErr);
        return res.status(500).json({
          success: false,
          message: "Database error while checking existing user",
          error: checkErr.message
        });
      }
      
      if (checkResults && checkResults.length > 0) {
        console.log("User already exists");
        return res.status(409).json({
          success: false,
          message: "Email or contact number already registered"
        });
      }
      
      // Hash password
      console.log("Hashing password...");
      let encryptedPassword;
      try {
        encryptedPassword = await hashingPassword(data.password);
        console.log("Password hashed successfully");
      } catch (hashError) {
        console.error("Password hashing failed:", hashError);
        return res.status(500).json({
          success: false,
          message: "Error processing password",
          error: hashError.message
        });
      }
      
      // Insert new user - FIXED: Use 'class' instead of 'clas'
      console.log("Inserting new user into database...");
      const insertQuery = `
        INSERT INTO students 
        (first_name, middle_name, last_name, father_name, instituteId, email, 
         contact, password, dob, gender, class, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())
      `;
      
      // Convert class string to number
      let classNumber;
      try {
        // Extract numeric part from class string (e.g., "10th" -> 10)
        const classMatch = data.clas.match(/\d+/);
        classNumber = classMatch ? parseInt(classMatch[0]) : 0;
        console.log("Class conversion:", data.clas, "->", classNumber);
      } catch (err) {
        classNumber = 0;
        console.log("Class conversion failed, using 0");
      }
      
      const insertParams = [
        data.first_name,
        data.middle_name || '',
        data.last_name,
        data.father_name,
        instituteId,
        data.email,
        data.contact,
        encryptedPassword,
        mysqlDate,
        data.gender,
        classNumber
      ];
      
      console.log("Insert parameters:", insertParams);
      
      mysqlcon.query(insertQuery, insertParams, (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Insert error:", insertErr);
          console.error("Full error object:", JSON.stringify(insertErr, null, 2));
          
          // Handle specific errors
          if (insertErr.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
              success: false,
              message: "Email or contact already exists"
            });
          } else {
            return res.status(500).json({
              success: false,
              message: "Registration failed due to database error",
              error: insertErr.message,
              code: insertErr.code,
              sqlMessage: insertErr.sqlMessage
            });
          }
        } else {
          console.log("Registration successful!");
          console.log("Insert result:", insertResult);
          
          return res.status(200).json({
            success: true,
            message: "Registered Successfully",
            data: {
              studentId: insertResult.insertId,
              email: data.email,
              class: data.clas, // Original class string
              classNumber: classNumber, // Converted number
              name: `${data.first_name} ${data.last_name}`,
              instituteId: instituteId,
              note: instituteId ? "Institute linked" : "Institute not provided, can be linked later"
            }
          });
        }
      });
    });
    
  } catch (error) {
    console.error("Unexpected error in registerController:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
}

async function loginController(req, res) {
  const { identifier, password } = req.body;
  const { type } = req.query;

  console.log("Type is,", type);
  
  if (!type || !identifier || !password) {
    res.status(400).json({ message: "invalid request type" });
  } else {
    const validation = await loginSchema.validate(req.body);
    
    if (validation.error) {
      res.status(403).json({
        message: validation.error.message,
      });
    } else {
      switch (Number(type)) {
        case 1:
          // Institute login code...
          break;
        case 0:
          //======================= Login for Students =======================
          // FIX: Remove 'clas' from attributes
          const studentData = await DBMODELS.students.findOne({
            where: {
              email: validation.value.identifier,
            },
            attributes: ["id", "password", "status", "profile", "first_name", "middle_name", "dob", "last_name", "instituteId", "email", "class", "contact"], // 'clas' से 'class' करें
            raw: true,
          });
          
          if (studentData) {
            let confirmedPass = await checkHashedPass(validation.value.password, studentData?.password);
            if (confirmedPass) {
              if (studentData.status === "active") {
                res.status(200).json({
                  message: "Logged in successfully loginController2",
                  user: { 
                    ...studentData, 
                    password: null, 
                    type: 0,
                    clas: studentData?.class || studentData?.clas // Handle both
                  },
                  jwt: await createJWT({
                    id: studentData?.id,
                    type: studentData?.type,
                    instituteId: studentData?.instituteId,
                    email: studentData?.email,
                    first_name: studentData?.first_name,
                    last_name: studentData?.last_name,
                    middle_name: studentData?.middle_name,
                    dob: studentData?.dob,
                    contact: studentData?.contact,
                    status: studentData?.status,
                    class: studentData?.class // Use correct field name
                  }),
                });
              } else {
                res.status(401).json({ message: "User is under verification" });
              }
            } else {
              res.status(404).json({ message: "Incorrect credentials combination" });
            }
          } else {
            res.status(404).json({ message: "User Not Found !" });
          }
          break;
        case 2:
          // Admin login code...
          break;
        default:
          res.status(404).json({ message: "User Type Not Found" });
          break;
      }
    }
  }
}

const googleCallbacks = async (googleReq,accessToken, refreshToken, profile, done) => {
  try {
   // Extract the email from the profile
   const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

   const userType = googleReq.query.state 
    // const userType = profile.state || 'Student'
    // console.log('auth controller ',googleReq.query.state)

   const user = await checkAndReturnUser(email)
   if(user){
    return done(null, user);
   }
   else{
    return done(null,{message:'nothing here', status:'fail', userType, email} )
   }


  } catch (error) {
    return done(error, null);
  }
};


async function sendEmailOtp(req, res) {
  const { email, first_name } = req.body;
  if (first_name && email) {
    await sentOtp(institution_name, email, (success) => {
      if (success) {
        res.status(202).json({ message: "OTP sent successfully on your email address" });
      } else {
        res.status(500).json({ message: "Error While Sending OTP" });
      }
    });
  } else {
    res.status(200).json({ message: "Invalid Request" });
  }
}
async function verifyEmailOtp(req, res) {
  const { email, otp } = req.body;
  if ((email, otp)) {
    DBMODELS.otpverify
      .findOne({
        where: {
          email,
        },
      })
      .then(async (result) => {
        const checkOtp = await checkHashedPass(String(otp), String(result.otp));
        if (checkOtp) {
          let successMessage = `${instituteStatus.institute_name} verified`;
          res.status(200).json({ message: successMessage, result: true });
          DBMODELS.otpverify.destroy({
            where: {
              email,
            },
          });
        } else {
          res.status(400).json({ message: "Incorrect OTP", result: false });
        }
      })
      .catch((error) => {
        logg.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      });
  } else {
    res.status(200).json({ message: "Invalid Request" });
  }
}

const resetPasswordEmailSendVersion2 = async(req,res)=>{
    const {email} = req.params
  try {
    const passwordResetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000/"}v2/auth/password-reset?email=${email}`;
  const replacements = {
    passwordResetUrl,
  };
  let mailConfig = {
    email: email,
    subject: `Reset Your Password`,
  };
  sendEmailService.sendTemplatedEmail(
    mailConfig,
    replacements,
    "PASSWORD_RESET_VERIFY_LINK"
  );
  // console.log('email', email)
  return res.json({
    message:'message send succesfully',

  })
    
  } catch (error) {
    return res.json()
  }
}

const resetPasswordEmailController = async(req,res)=>{
    const {email,password} = req.params
    try {
      let  hashPassword = await hashingPassword(password)
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
    const checkStudentRegDetail = await DBMODELS.student_reg_details.findOne({
      where:{
        email
      }
    })

    const checkTeacherRegDetail = await DBMODELS.teacher_reg_details.findOne({
      where:{
        email
      }
    })

    const checkInstituteRegDetail = await DBMODELS.institute_reg_details.findOne({
      where:{
        email
      }
    })
    if(checkCoord){
      await DBMODELS.institute_coordinators.update({password:hashPassword},{
        where:{
          email
        }
      })
    }
    if(checkInstitute){
      await DBMODELS.institutions.update({password:hashPassword},{
        where:{
          email
        }
      })
    }
    if(checkStudent){
      await DBMODELS.students.update({password:hashPassword},{
        where:{
          email
        }
      })
    }
    if(checkStudentRegDetail){
      await DBMODELS.student_reg_details.update({password:hashPassword},{
        where:{
          email
        }
      })
    }
    if(checkTeacherRegDetail){
      await DBMODELS.teacher_reg_details.update({password:hashPassword},{
        where:{
          email
        }
      })
    }
    if(checkInstituteRegDetail){
      await DBMODELS.institute_reg_details.update({password:hashPassword},{
        where:{
          email
        }
      })
    }

    return res.json({
      message:"updated successfully",

    })
    

 

  } catch (error) {
    return res.json({
      message:'internal server error', 
      error:error.message
    })
  }
}

module.exports = {
  googleCallbacks,
  googleLogin,
  googleCallback,
  newLoginController,
  registerController,
  loginController,
  sendEmailOtp,
  resetPasswordEmailSendVersion2,
  resetPasswordEmailController,
};
