const { profileAllRoleRouter } = require('./profileAPi/allStudentTeach');
const discussionBoardRouter = require('./discussion_board/discussion_board');
const eventsRouterV2 = require('./event/events');
const instituteV2Router = require('./institute');
const modelUnRegisterRouter = require('./modelUn_register/modeUn');
const {modelUnMediaRouter} = require('./modelUnMeadia/model_un_media-image')
const { ModelUnStudentRouter } = require('./modelUn_student/modelUnStudent');
const onBoardV2Router = require('./onBoarding');
const profileV2Router = require('./profile/profile');
const adminV2Router = require('./admin/admin');
const adminRouter = require('./adminCSV/adminCSV');
const cfcRouter = require('./carbon_footprint_cal/carbon_footprint_calculator');
const newCSVRouter = require('./newCSV/newCSV');
const day21Challenge = require('./21daysChallenge/21daysChallenge');
const steps75 = require('./75steps/75steps');
const notificationRouter = require('./notification/notification');
const userV2Router = require('./User/user');
const clubV2Router = require('./Clubs/clubs');
const { reviewRouter } = require('./review_rating/review');
const riasecRouter = require('./riasecTest/riasecTest');
const lsmtRouter = require('./lsmtTest/lsmtTest');
// const fileUploadRouter = require('./fileUpload/fileUpload');
const deletionInstituteRouter = require('./DeleteInstituteId/deleteUser');
const { default: axios } = require('axios');
const { highlightRouter } = require('./highlights/highlights');

// creating the route middleware
const routesV2 = require("express")();

// routesV2.use("/fileUpload", fileUploadRouter);
routesV2.use("/institute", instituteV2Router);
routesV2.use("/user", userV2Router);
routesV2.use("/modelUn-institute", modelUnRegisterRouter);
routesV2.use("/modelUn-student", ModelUnStudentRouter);
routesV2.use("/modelUnMedia", modelUnMediaRouter);
routesV2.use("/getAllProfile", profileAllRoleRouter);
routesV2.use("/onBoarding", onBoardV2Router);
routesV2.use("/profile", profileV2Router);
routesV2.use("/admin", adminV2Router);
routesV2.use("/adminNew", adminRouter);
routesV2.use("/cfc", cfcRouter);
routesV2.use("/csvUpload", newCSVRouter);
routesV2.use("/21daysChallenge", day21Challenge);
routesV2.use("/75daysChallenge", steps75);
routesV2.use("/notification", notificationRouter);
routesV2.use("/clubs", clubV2Router);
routesV2.use("/reviews", reviewRouter);
routesV2.use("/highlight", highlightRouter);
routesV2.use("/riasecTest", riasecRouter); // RIASEC
routesV2.use("/lsmtTest", lsmtRouter); // LSMT - MS
routesV2.use("/deleteUser", deletionInstituteRouter);
routesV2.use("/discussion_board", discussionBoardRouter);
routesV2.use("/events", eventsRouterV2);

routesV2.get("/pdf", async (req, res) => {
  const pdfURL = req.query.url;
  if (!pdfURL) {
    return res.status(400).send("URL parameter is required.");
  }
  try {
    const response = await axios.get(pdfURL, { responseType: "arraybuffer" });
    res.setHeader("Content-Disposition", 'inline; filename="proxied.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to fetch PDF.");
  }
});

module.exports = routesV2;
