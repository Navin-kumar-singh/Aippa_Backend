const express = require("express");
const { 
    getUnderReviewInstitute, 
    approveinstitute, 
    rejectInstitute, 
    getUnderReviewInstituteById, 
    getSingleInstituteData, 
    approvedSinglInst, 
    getInsituteDetail, 
    searchInstitute, 
    getInsituteByDate, 
    deleteSingleInstitute, 
    getNipamData, 
    getNipamWithoutKv, 
    allNipamWithDate, 
    getNipamWithoutKvData, 
    getNipamWithoutKvDate, 
    getNipamWithKv, 
    getNipamWithKvDate, 
    cbseDataUpload, 
    uploader, 
    getSearchNipamData, 
    getAllCbseDetail, 
    deleteCbseDetails, 
    getSingleCbseData, 
    adminCommentsCreated, 
    createAssignData, 
    getSubadminData, 
    getDataToSubadmin, 
    getAssignData, 
    getBasedOnStateDistrict, 
    getAllAsignData, 
    getSingleSubadminData, 
    getComments, 
    getStateAssignedData, 
    updateEmailandMobileData, 
    searchUnderReviewDataNew ,
    schoolCallingStatus,
    getSchoolCallingStatus,
    editComments,
    addSingleCbseAltData,
    addMultiCbseAltData,
    getAllStateName,
    getAllDistrictName,
    getAllreminder,
    getCallingStatus
} = require("./admin.controller");

const adminV2Router = express.Router();

adminV2Router.get("/getUnderReviewInstitute", getUnderReviewInstitute);
adminV2Router.get("/getUnderReviewInstituteById/:instituteId", getUnderReviewInstituteById);
adminV2Router.put("/approveinstitute/institute/:instituteId", approveinstitute);
adminV2Router.put("/rejectInstitute/institute/:instituteId", rejectInstitute);
adminV2Router.get("/singleInstitute/:instituteId", getSingleInstituteData);
adminV2Router.get("/getInstituteData", getInsituteDetail);
adminV2Router.put("/aprovedSingleInstitute/:instituteId", approvedSinglInst);
adminV2Router.delete('/reject-institute/:instituteId', deleteSingleInstitute);
adminV2Router.get("/serachInstitute", searchInstitute);
adminV2Router.get('/getUnderReviewInstituteNew', searchUnderReviewDataNew);
adminV2Router.get("/getDataByDate/:startDate/:endDate/:type", getInsituteByDate);
adminV2Router.get("/getNipamData", getNipamData);
adminV2Router.get("/allNipamWithDataDate/:startDate/:endDate/:type", allNipamWithDate);
adminV2Router.get("/getNipamDataWithoutKv", getNipamWithoutKv);
adminV2Router.get("/getNipamDataWithoutKvDate/:startDate/:endDate", getNipamWithoutKvDate);
adminV2Router.get("/allNipamWithKv", getNipamWithKv);
adminV2Router.get("/allNipamWithKvDate/:startDate/:endDate", getNipamWithKvDate);
adminV2Router.get("/searchNipamData", getSearchNipamData);
// adminV2Router.post("/cbse_data_upoad", routeVerifierJwt, uploader.single("file"), excelToJson, cbseDataUpload);
adminV2Router.post("/cbse_data_upoad", uploader.single("file"), cbseDataUpload);
adminV2Router.get("/getAllCbseDetail", getAllCbseDetail);
adminV2Router.get("/getSingleCbseData/:id", getSingleCbseData);
adminV2Router.post("/addSingleCbseAltData/:id", addSingleCbseAltData);
adminV2Router.post("/addMultiCbseAltData/:id", addMultiCbseAltData);
adminV2Router.delete("/deleteCbseDetail/:id", deleteCbseDetails);
adminV2Router.post("/adminCreateAssign", createAssignData)
adminV2Router.get("/getAssignData/:subAdmin_Id", getAssignData)
adminV2Router.get("/getAllAssignData", getAllAsignData)
adminV2Router.get("/getAllStateName", getAllStateName)
adminV2Router.get("/getAllDistrictName/:state", getAllDistrictName)
adminV2Router.get("/getAssignedData/:id", getStateAssignedData)
adminV2Router.get("/getSubadminData", getSubadminData)
adminV2Router.get("/getCbseDetail", getDataToSubadmin)
adminV2Router.get("/getStateDistrict/:state", getBasedOnStateDistrict)
adminV2Router.get("/getSingleAdminStateData/:id", getSingleSubadminData)
adminV2Router.post("/adminCommentsCreated", adminCommentsCreated)
adminV2Router.get("/getComments/:id", getComments)
adminV2Router.put("/editComments/:id", editComments)

// subadmin status routes
adminV2Router.put("/SchoolCallingStatus/:schoolId", schoolCallingStatus)
adminV2Router.get("/getSchoolCallingStatus/:schoolId", getSchoolCallingStatus)
adminV2Router.get("/getAllreminder/:id", getAllreminder)



// Subadmin status routes
adminV2Router.put("/SchoolCallingStatus/:schoolId", schoolCallingStatus);
adminV2Router.get("/getSchoolCallingStatus/:schoolId", getSchoolCallingStatus);

adminV2Router.get("/callingStatus/:id", getCallingStatus);

module.exports = adminV2Router;
