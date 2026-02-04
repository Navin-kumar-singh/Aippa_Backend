// const { ImageReduce } = require('../../service/imageSizeReducer');
// const { LocalMulter } = require('../../service/localMulter');
const {
  addQuestion,
  getAllQuestion,
  editQuestion,
  deleteQuestion,
  getQuestionById,
  getAttempt,
  postAttempt,
  careerBasedOnScore,
  testAttendees,
  parentEmailResult,
  handleFeedback,
  assignCareerGuide,
  updateCareerGuide,
  getAllUnassignedCareerGuides,
  getAllAssignedCareerGuides,
  getCareerGuideData,
  getFeedbackData,
} = require("./riasecTest.controller");

const riasecRouter = require("express")();

riasecRouter.post("/addQuestion", addQuestion);
// riasecRouter.get('/add-to-career', addToCareerList); // for storing into the database
riasecRouter.get("/allQuestion", getAllQuestion); // -> 1
riasecRouter.put("/editQuestion/:id", editQuestion);
riasecRouter.delete("/delete/:id", deleteQuestion);
riasecRouter.get("/question/:id", getQuestionById);

//user attempt
riasecRouter.get("/getAttempt/:userId/:role", getAttempt); // -> 2
riasecRouter.post("/postAttempt", postAttempt); // -> 3

// Api for sending email user's test result
riasecRouter.post("/riasec-result-email/:studentId", parentEmailResult); // -> 4

// riasec career name and description api
riasecRouter.get("/riasec-careers/:userId", careerBasedOnScore);

// riasec attendees and non-attendees list
riasecRouter.post("/riasec-attempt-status", testAttendees);

// riasec feedback from teacher and institute
riasecRouter.post("/riasec-student-feedback", handleFeedback);

// Fetching all feedbacks
riasecRouter.get("/riasec-feedbacks/:studentId", getFeedbackData);

// riasec and lsmt career guide assignment
riasecRouter.post("/riasec-guide-assign", assignCareerGuide);

// riasec and lsmt career guide assignment
riasecRouter.put("/riasec-guide-update", updateCareerGuide);

// riasec and lsmt career guide assignment
riasecRouter.get(
  "/riasec-unassigned/:instituteId",
  getAllUnassignedCareerGuides
);

// riasec and lsmt career guide assignment
riasecRouter.get("/riasec-assigned/:instituteId", getAllAssignedCareerGuides);

// riasec and lsmt career guide assignment
riasecRouter.get("/riasec-guide-info/:teacherId", getCareerGuideData);

module.exports = riasecRouter;