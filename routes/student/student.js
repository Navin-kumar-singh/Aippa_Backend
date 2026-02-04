/*
  =========== Student Control Routes =============
  - Student Contol
  - Stunet Poll Control
   */
const { ImageReduce } = require("../../service/imageSizeReducer");
const { LocalMulter } = require("../../service/localMulter");
const { upload } = require("../../service/upload");
const { routeVerifierJwt } = require("../auth/jwt");
const {
  
  fetchDetails,
  updateProfile,
  studentOnboard,
  applyForParticipation,
  getEductaionType,
  fetchAll,
  updateStudent,
} = require("./student.controller");

const StudentRouter = require("express").Router();

//update student
StudentRouter.put("/updateStudent/:studentId", updateStudent);

//fetch all student
StudentRouter.get("/allInOne",fetchAll )

StudentRouter.get("/detail", routeVerifierJwt, fetchDetails);
StudentRouter.put(
  "/profile",
  routeVerifierJwt,
  LocalMulter.single("file"),
  ImageReduce(200, "profile/"),
  updateProfile
);
StudentRouter.post(
  "/onboard",
  LocalMulter.single("profile"),
  ImageReduce(200, "profile/"),
  routeVerifierJwt,
  studentOnboard
);
StudentRouter.get(
  "/onboard/education",
  routeVerifierJwt,
  getEductaionType

)
StudentRouter.post(
  "/apply/delegate",
  routeVerifierJwt,
  applyForParticipation
);

//Student Poll Routes
const {
  getPollData,
  getVoteCount,
  fetchpollData,
  setPollData,
  EditPollData,
} = require("./studentPollControl");
StudentRouter.get("/studentpoll", routeVerifierJwt, getPollData);
StudentRouter.post("/studentpoll", routeVerifierJwt, setPollData);
StudentRouter.put("/studentpoll", routeVerifierJwt, getVoteCount);
//Edit Poll Route
StudentRouter.get("/editPoll", routeVerifierJwt, fetchpollData);
StudentRouter.post("/editPoll", routeVerifierJwt, EditPollData);
module.exports = StudentRouter;
