/* 
  ===========Course And Certificate Routes======= 
  - update / fetch / check Certificstes
  - fetch Coures
  - Add / fetch Emrollments
  - get / update progres 
  - update / fetch course review 
*/

const courseRouter = require("express").Router();
const { upload } = require("../../service/upload");
const { routeVerifierJwt } = require("../auth/jwt");
const {
  fetchQuiz,
  quizResult,
  createQuiz,
  fetchAllQuiz,
  fetchQuetions,
  createQuestion,
} = require("./courseQuiz");
const {
  fetchCertificate,
  fetchAllCertificates,
  PostCertificate,
  fetchOpenCertificate,
  checkCertificate,
  PostEkalEventCompletionCertificate,
  GetEkalEventCompletionCertificate,
  getRating,
  PostNipamCertifateApply,
} = require("./certificate.controller");
const { fetchCourse, GetCourses } = require("./course.controller");
const {
  AddEnrollment,
  GetEnrolledCourses,
  getprogress,
  progressUpdater,
  GetEnrolledCourseView,
  IsStudentEnrolled,
} = require("./enrollCourse.controller");
const { postReview, fetchReview } = require("./review.controller");

// APIs for Course View
courseRouter.get("/detail/:courseId", fetchCourse);
courseRouter.get("/", GetCourses);

//API for Quiz
courseRouter.put("/quiz/:studentId", routeVerifierJwt, quizResult);
courseRouter.post("/quiz/:studentId", routeVerifierJwt, fetchQuiz);
courseRouter.get("/quiz/fetch", routeVerifierJwt, fetchAllQuiz);
courseRouter.post("/quiz/create", routeVerifierJwt, createQuiz);
courseRouter.get("/quiz/questions", routeVerifierJwt, fetchQuetions);
courseRouter.post("/quiz/questions", routeVerifierJwt, createQuestion);

//APIs for Certificate
courseRouter.get("/certificate", routeVerifierJwt, fetchCertificate);
courseRouter.get("/certificate/check", checkCertificate);
courseRouter.get("/public/certificate", fetchOpenCertificate);
courseRouter.get("/allcertificates", routeVerifierJwt, fetchAllCertificates);
courseRouter.post('/certificateApply',routeVerifierJwt,PostNipamCertifateApply)
courseRouter.post(
  "/certificate",
  upload.single(""),
  routeVerifierJwt,
  PostCertificate
);
// APIs FOR ENROLLED COURSES
courseRouter.post(
  "/enroll",
  upload.single("No Upload"),
  routeVerifierJwt,
  AddEnrollment
);
courseRouter.post(
  "/enrolled",
  upload.single("No Upload"),
  routeVerifierJwt,
  GetEnrolledCourses
);
courseRouter.post(
  "/enrolled/view",
  upload.single("No Upload"),
  routeVerifierJwt,
  GetEnrolledCourseView
);
courseRouter.post(
  "/updateprogress",
  upload.single("No Upload"),
  routeVerifierJwt,
  progressUpdater
);
courseRouter.post(
  "/getprogress",
  upload.single("No Upload"),
  routeVerifierJwt,
  getprogress
);
// APIs FOR COURSE REVIEW
courseRouter.post("/review", upload.single(""), routeVerifierJwt, postReview);
courseRouter.get("/review", routeVerifierJwt, fetchReview);

/* Ekal Event Upload Certifiacte */
courseRouter.post(
  "/ekal_certificate",
  routeVerifierJwt,
  PostEkalEventCompletionCertificate
);
courseRouter.get(
  "/ekal_certificate",
  routeVerifierJwt,
  GetEkalEventCompletionCertificate
);

//===== Api  for getting rating  =================\\
courseRouter.get('/rating-based-on-unit/courseId/:courseId',getRating)
courseRouter.get("/IsStudentEnrolled/:studentId/courseId/:courseId",IsStudentEnrolled)
module.exports = courseRouter;
