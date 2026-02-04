const { routeVerifierJwt } = require("../../routes/auth/jwt");
const {
  fetchStudentDetails,
  deleteStudentDetails,
  checkOnBoardStatus,
  getAllInstitute,
  getInstituteManager,
  getAllUsers,
  approveUser,
  getAllUsersNew,
  approveUserNew,
  rejectUserNew,
  getInstituteCountStateWise,
  getAllPollsQuestion,
  selectedPollOption,
  checkUserAlreadyAttempt,
  getVotesCount,
  getInstituteProfileData,
  getLatestPolls,
  addMessageToAdmin,
  getSingleInstituteData,
  getAllUserParticularInst,
  postAccountManager,
  getAccountManager,
  deleteAccountManager,
  editAccountManager,
  fetchCountryData,
  fetchStateData,
  getAllinstituteData,
  fetchInstituteDetails,
  isNipamInstitute,
  getMultipleTeachStud,
  // addMultiPleTeacStud,
  getInstituteName,
  getStudentProfile,
  updateStudentProfile,
  updateStudentDetails,
  updateStudentAttendance,
} = require("./user.controller");
const { excelToJson, uploader } = require("../../middleware/excelToJson");
const {
  studentBulkLogin,
  studentBulkLoginAdminCSV,
  // uploadTempInstituteFile,
} = require("../../routes/institute/studentBulkLogin");
const instituteV2Router = require("express").Router();

instituteV2Router.get("/fetchStudentDetails", fetchStudentDetails);
instituteV2Router.get(
  "/fetchInstituteDetails/:instituteId",
  fetchInstituteDetails
);

instituteV2Router.delete("/deleteStudent", deleteStudentDetails);
instituteV2Router.get("/checkOnBoardStatus/:email", checkOnBoardStatus);
instituteV2Router.get(
  "/getInstituteManager/institute/:instituteId",
  getInstituteManager
);
instituteV2Router.get("/getAllUsers/institute/:instituteId", getAllUsersNew);
instituteV2Router.put(
  "/approveUser/institute/:instituteId/student/:studentId/role/:role",
  approveUserNew
);
instituteV2Router.put(
  "/rejectUserNew/institute/:instituteId/student/:studentId/role/:role",
  rejectUserNew
);

// get institute count state wise
instituteV2Router.get(
  "/getInstituteCount/StateWise",
  getInstituteCountStateWise
);

// get all institute
instituteV2Router.get("/getAllInstitute", getAllInstitute);

// polls api
instituteV2Router.get("/getAllPollsQuestion", getAllPollsQuestion);
// instituteV2Router.get("/getAllPollsAnswer", getAllPollsAnswer);
instituteV2Router.post("/selectedPollOption/", selectedPollOption);

instituteV2Router.get(
  "/checkUserAlreadyAttempt/studentId/:studentId/questionId/:questionId",
  checkUserAlreadyAttempt
);

instituteV2Router.get("/getVotesCount/questionId/:questionId", getVotesCount);

instituteV2Router.get(
  "/getInstituteProfileData/id/:id/insituteDetail",
  getInstituteProfileData
);
instituteV2Router.get("/getLatestPolls", getLatestPolls);

instituteV2Router.post("/addMessageToAdmin/", addMessageToAdmin);
instituteV2Router.get("/getInsituteData/:instituteId", getSingleInstituteData);
instituteV2Router.get(
  "/getInsituteUsers/:instituteId",
  getAllUserParticularInst
);

//========= Add single account manager after  institute registration ================ \\\

instituteV2Router.post("/postAddManager", postAccountManager);
instituteV2Router.put("/editAddManager/:id", editAccountManager);
instituteV2Router.get("/getAccManager/:instituteId", getAccountManager);
instituteV2Router.delete("/deleteAccManager/:Id", deleteAccountManager);

instituteV2Router.get("/fetchCountryData/", fetchCountryData);

instituteV2Router.get("/fetchStateData/:country", fetchStateData);

instituteV2Router.get("/fetchInstituteData/", getAllinstituteData);

instituteV2Router.get("/isNipamInstitute/:email", isNipamInstitute);

// upload excel sheet
// instituteV2Router.post(
//   "/uploadtempfiles/:role",
//   routeVerifierJwt,
//   // uploadTempInstituteFile
// );

// upload excel sheet data in database
instituteV2Router.post("/studentBulkLogin", routeVerifierJwt, studentBulkLogin);
// upload excel sheet by admin
instituteV2Router.post(
  "/studentBulkLoginAdmin",
  routeVerifierJwt,
  studentBulkLoginAdminCSV
);
// get excel sheet
instituteV2Router.get(
  "/getMultipleTeacherStudent/:instituteId/:role",
  getMultipleTeachStud
);
// edit excel data
instituteV2Router.put(
  "/studentDetailsCorrection/:instituteId",
  updateStudentDetails
);
// marking the attendance
instituteV2Router.put(
  "/markStudentAttendance/:instituteId",
  routeVerifierJwt,
  updateStudentAttendance
);

instituteV2Router.get("/getInstituteId/:instituteId", getInstituteName);

instituteV2Router.get(
  "/getStudentProfileDetail/:role/:studentId",
  getStudentProfile
);

instituteV2Router.put(
  "/updateStudentProfileDetail/:role/:studentId",
  updateStudentProfile
);

module.exports = instituteV2Router;
