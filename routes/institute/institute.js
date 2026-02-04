
  const { upload } = require("../../service/upload");
  const { routeVerifierJwt } = require("../auth/jwt");
  const { AutoAssignHandler } = require("./event.controller");
  const { ImageReduce } = require("../../service/imageSizeReducer");
  const { LocalMulter } = require("../../service/localMulter");
  
  const {
    createCompliance,
      deleteCompliance,
      updateCompliance,
      getCompliance,
      createQuestion,
      getComplianceById,
      getAllQuestionByCategory,
      deleteQuestion,
      updateQuestion,
      getQuestionById,
      getAllQuestion,
      createAnswer,
      getAnswer,
      deleteAnswer,
      updateAnswer,
      getAnswerById,
      createCategory,
      deleteCategory,
      updateCategory,
      getCategoryById,
      getAllCategories,
      getAllCategoriesByComplianceId,
      createResponse,
      deleteResponse,
      updateResponse,
      getAllResponses,
      getResponseByComplianceId,
      getResponseByInstituteId,
      getResponseById,
      getAllQuestionByCompliance,
  } = require('./compliance.controller')
  const {
    addCoordinator,
    updateCoordinator,
    DeleteCoordinator,
    fetchCoordinator,
    fetchAllCoordinator,
  } = require("./coordinator.controller");
  const {
    getinformation,
    getinformationV2,
    getlessinfo,
    deleteStudent,
    fetchData,
    updateProfile,
    getAllCertificates,
    instituteOnboard,
    addStudentTODelegate,
    fetchStudentTODelegate,
    deleteStudentTODelegate,
    updateOnboard,
    getGallery,
    postGallery,
    updateGallery,
    deleteGallery,
    fetchDataV2,
    getToAffiliate,
    removeToAffiliate,
    getCountDelegate,
    getCountStudent,
    addStudent,
    instituteEventUpdate,
    instituteGetEventDate,
    fetchAllInstitutes,
    updateInstitute,
    getAllEnrollments,
  } = require("./institute.controller");
  
  const instituteRouter = require("express").Router();
  
  instituteRouter.get("/allInOne", fetchAllInstitutes);
  instituteRouter.put("/updateInstitute/:instituteId", updateInstitute);
  
  instituteRouter.post(
    "/",
    upload.single("any"),
    routeVerifierJwt,
    getinformation
  );
  instituteRouter.get("/", routeVerifierJwt, getinformationV2);
  instituteRouter.get("/data", routeVerifierJwt, fetchDataV2);
  instituteRouter.post("/info", getlessinfo);
  instituteRouter.post("/info", getlessinfo);
  instituteRouter.delete(
    "/student",
    upload.single("any"),
    routeVerifierJwt,
    deleteStudent
  );
  instituteRouter.post("/addstudent", addStudent);
  instituteRouter.put(
    "/profile",
    routeVerifierJwt,
    LocalMulter.single("file"),
    ImageReduce(200, "institute/profile/"),
    updateProfile
  );
  instituteRouter.get("/certificates", routeVerifierJwt, getAllCertificates);
  instituteRouter.get("/enrollments", routeVerifierJwt, getAllEnrollments);
  instituteRouter.post(
    "/onboard",
    routeVerifierJwt,
    LocalMulter.single("logo"),
    ImageReduce(200, "institute/profile/"),
    instituteOnboard
  );
  instituteRouter.post(
    "/onboard/event-update",
    routeVerifierJwt,
    instituteEventUpdate
  );
  instituteRouter.get(
    "/onboard/event-update",
    routeVerifierJwt,
    instituteGetEventDate
  );
  
  instituteRouter.post("/onboard/update", routeVerifierJwt, updateOnboard);
  // ================DELEGATES====================
  instituteRouter.post("/addtodelegate", routeVerifierJwt, addStudentTODelegate);
  instituteRouter.post("/delegates", routeVerifierJwt, fetchStudentTODelegate);
  instituteRouter.delete("/delegate", routeVerifierJwt, deleteStudentTODelegate);
  instituteRouter.post(
    "/delegates/autoassign",
    routeVerifierJwt,
    AutoAssignHandler
  );
  instituteRouter.post("/delegatee", routeVerifierJwt, getCountDelegate);
  instituteRouter.post("/studente", routeVerifierJwt, getCountStudent);
  
  // ================END DELEGATES====================
  instituteRouter.post("/coordinator", routeVerifierJwt, addCoordinator);
  instituteRouter.get("/coordinator", routeVerifierJwt, fetchCoordinator);
  instituteRouter.put("/coordinator", routeVerifierJwt, updateCoordinator);
  instituteRouter.delete("/coordinator", routeVerifierJwt, DeleteCoordinator);
  instituteRouter.get("/coordinator/all", routeVerifierJwt, fetchAllCoordinator);
  
  // Event Routes
  const {
    instituteEvent,
    getEvent,
    deleteEvent,
    EventFormData,
  } = require("./instituteEvent");
  instituteRouter.get("/eventData", routeVerifierJwt, EventFormData);
  instituteRouter.post("/event", routeVerifierJwt, instituteEvent);
  instituteRouter.get("/event", routeVerifierJwt, getEvent);
  instituteRouter.delete("/event", routeVerifierJwt, deleteEvent);
  module.exports = instituteRouter;
  
  // Student bulk register Routes
  const { excelToJson, uploader } = require("../../middleware/excelToJson");
  const { studentBulkLogin, studentBulkLoginAdminCSV, checkEmails, studentBulkLoginAdmin } = require("./studentBulkLogin");
  
  instituteRouter.post(
    "/bulklogin",
    routeVerifierJwt,
    uploader.single("file"),
    excelToJson,
    studentBulkLogin
  );

  instituteRouter.post(
    "/bulklogin-admin-csv",
    routeVerifierJwt,
    studentBulkLoginAdminCSV
  );
  
  instituteRouter.post(
    "/bulklogin-admin",
    routeVerifierJwt,
    uploader.single("file"),
    excelToJson,
    studentBulkLoginAdmin
  );
  // fetch All Emails For Validation
  instituteRouter.post("/allEmails", routeVerifierJwt, checkEmails);
  
  //Institute Bulk Register Routes
  const { instituteBulkRegister } = require("./instituteBulkRegister");
  instituteRouter.post(
    "/bulkregister",
    routeVerifierJwt,
    uploader.single("file"),
    excelToJson,
    instituteBulkRegister
  );
  
  instituteRouter.get("/institute-gallery/:id", getGallery);
  instituteRouter.post(
    "/institute-gallery/:id",
    LocalMulter.single("img"),
    ImageReduce(500, "event/"),
    postGallery
  );
  instituteRouter.put(
    "/institute-gallery",
    LocalMulter.single("img"),
    ImageReduce(500, "event/"),
    updateGallery
  );
  instituteRouter.delete("/institute-gallery", deleteGallery);
  
  //Student Coordinaters Routes
  const {
    getStdCoordinater,
    addStdCoordinator,
    deleteStdCoordinater,
  } = require("./student.coordinaters");
  instituteRouter.get("/studentCoordinate", routeVerifierJwt, getStdCoordinater);
  instituteRouter.post("/studentCoordinate", routeVerifierJwt, addStdCoordinator);
  instituteRouter.delete(
    "/studentCoordinate",
    routeVerifierJwt,
    deleteStdCoordinater
  );
  //Institutte Affiliate
  
  instituteRouter.get("/institutes-affiliated", getToAffiliate);
  instituteRouter.put("/institutes-affiliated", removeToAffiliate);
  
  const { testingEmail } = require("./testingBulkEmail");
  
  instituteRouter.post(
    "/testing",
    uploader.single("file"),
    excelToJson,
    testingEmail
  );
  
  const {
    mediaUpload,
    fetchMedia,
    deleteMedia,
    uploadCommuinque,
    fetchCommuinque,
    deleteCommuinque,
  } = require("./mediaCoverages");
  instituteRouter.get("/institute-media", routeVerifierJwt, fetchMedia);
  instituteRouter.post(
    "/institute-media",
    routeVerifierJwt,
    upload.single("img"),
    mediaUpload
  );
  instituteRouter.delete("/institute-media", routeVerifierJwt, deleteMedia);
  
  //// Commuinque Routes
  instituteRouter.post(
    "/institute-comque",
    routeVerifierJwt,
    upload.single("file"),
    uploadCommuinque
  );
  instituteRouter.get("/institute-comque", routeVerifierJwt, fetchCommuinque);
  instituteRouter.delete("/institute-comque", routeVerifierJwt, deleteCommuinque);
  
  /* Event Winner Routes  */
  const {
    addEventWinner,
    fetchAllEventWinner,
    deleteEventWinner,
  } = require("./eventWinnersControl");
  
  instituteRouter.post("/event-winners", routeVerifierJwt, addEventWinner);
  instituteRouter.get("/event-winners", routeVerifierJwt, fetchAllEventWinner);
  instituteRouter.delete("/event-winners", routeVerifierJwt, deleteEventWinner);
  
  
  //===========  All  compliance routes  here ===============\\
  
  //compliance 
  instituteRouter.post('/compliance', createCompliance);
  instituteRouter.delete('/compliance/:id', deleteCompliance);
  instituteRouter.put('/compliance/:id', updateCompliance);
  instituteRouter.get('/compliance', getCompliance);
  instituteRouter.get('/compliance/:id', getComplianceById);
  
  //compliance question
  
  instituteRouter.post('/compliance_question', createQuestion)
  instituteRouter.get('/compliance_question', getAllQuestion)
  instituteRouter.get('/compliance_question/:id', getQuestionById)
  instituteRouter.get('/compliance_question/category/:categoryId', getAllQuestionByCategory)
  instituteRouter.delete('/compliance_question/:id', deleteQuestion)
  instituteRouter.put('/compliance_question/:id', updateQuestion)
  instituteRouter.get('/compliance_question/compliance/:complianceId', getAllQuestionByCompliance);
  
  // compliance category
  
  instituteRouter.post('/compliance_category', createCategory)
  instituteRouter.get('/compliance_category', getAllCategories)
  instituteRouter.get('/compliance_category/:id', getCategoryById)
  instituteRouter.get('/compliance_category/compliance/:complianceId', getAllCategoriesByComplianceId)
  instituteRouter.delete('/compliance_category/:id', deleteCategory)
  instituteRouter.put('/compliance_category/:id', updateCategory)