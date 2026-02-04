const { upload } = require("../../service/upload");
const express = require("express");
const { institutionPost, verifyOtp, instituteRegisterationController, checkEmailExist,
   checkEmailVerification, verifyingInstitute, postInstituteOnBoardData, checkUnderReviewStatus,
   transferInstitute, newInstituteRegisterController, studentRegisterationController,
    newStudentRegister, postStudentOnBoardData, checkEmailVerificationStudent,
     verifyingUser, checkUnderReviewStatusUser, autoSaveInstitute, getAutoSaveData, managerDetailds, getInstituteDetail, getSubRoles,updateInsData, 
     saveInstituteOnBoardData,
     getOnboardingData,
     getVerifyinsPassFill,
     saveStudentOnBoardData,
     getStudentOnboardingData} = require("./register.controller");
const {LocalMulter} = require("../../service/localMulter");
const { ImageReduce } = require("../../service/imageSizeReducer");
const RegisterRouterV2 = express.Router();
RegisterRouterV2.post("/institution", institutionPost);

// ===================================== FOR INSTITUTE   =====================================

RegisterRouterV2.post("/institution/verify-email", instituteRegisterationController);
RegisterRouterV2.put("/verifying/institute", verifyingInstitute);
// create institute after under Review done
RegisterRouterV2.post('/createInstituteAfterReview/',transferInstitute)
// new register route with email and password only
RegisterRouterV2.post("/newInstituteRegister", newInstituteRegisterController)
// check under review status
RegisterRouterV2.get('/checkUnderReviewStatus/email/:email',checkUnderReviewStatus)
// institute is verified
RegisterRouterV2.post("/is-verified", checkEmailVerification);
// post all Insitute data in institute_reg_details
RegisterRouterV2.put("/institute/on-board-data", postInstituteOnBoardData)

// auto save data for onBoarding
RegisterRouterV2.put("/institute/autosave/:id", autoSaveInstitute)
// get auto save data 
RegisterRouterV2.get("/institute/getAutoSaveData/:id", getAutoSaveData)
RegisterRouterV2.get("/instituteGetData/:email",getVerifyinsPassFill)


// ================FOR STUDENT=============================

RegisterRouterV2.post("/student/verify-email", studentRegisterationController);
//verify User
RegisterRouterV2.put("/verifying/user", verifyingUser);

// institute is verified
RegisterRouterV2.post("/is-verified/student", checkEmailVerificationStudent);

RegisterRouterV2.post("/newStudentRegister", newStudentRegister)

RegisterRouterV2.get("/getInsDetail/:instituteId", getInstituteDetail)

// here we create data in student table using student_reg_details
RegisterRouterV2.put("/student/on-board-data", postStudentOnBoardData)

// check under review status

RegisterRouterV2.get('/checkUnderReviewStatus/email/:email/role/:role',checkUnderReviewStatusUser)

//====== Institute update documnet details Details api when user in under review ===============\\
RegisterRouterV2.put('/updateData/:instituteId',updateInsData)
// ========================for general purpose ===================================

// check if email exist
RegisterRouterV2.post("/checkEmailExist", checkEmailExist);
RegisterRouterV2.post("/verify", verifyOtp);
RegisterRouterV2.get("/managerDetails/:managerId",managerDetailds)
RegisterRouterV2.get('/getSubroles/:email',getSubRoles)
//========= An api for onboarding data save when user is logged out ================\\
RegisterRouterV2.put('/saveOnboardingData/:email',saveInstituteOnBoardData)
RegisterRouterV2.get('/getOnboardingData/:email',getOnboardingData)


//===========  For Student onboard data save when user does not complete the onboarding process =========\\ 

RegisterRouterV2.put('/saveStudentOnboardingData/:email/type/:type',saveStudentOnBoardData)
RegisterRouterV2.get('/getStudentOnboardingData/:email/type/:type',getStudentOnboardingData)
// image upload for institute
RegisterRouterV2.post("/uploadInstituteLogo/",
upload.single("img")
,async(req,res)=>{
   try {
      console.log("req", req.file)
     const logo = req?.file?.location;
     return res.json({result:logo})
   } catch (error) {
        return res.json({error:error.message})
   }
})
// 

module.exports = { RegisterRouterV2 };
