const {
  emailValidation,
  csvInstituteList,
  instituteCSVCount,
} = require("./adminCSV.controller");

const adminRouter = require("express")();

// for checking whether an institute is registered or not on YM
adminRouter.post("/verify-institute-email", emailValidation);

// for listing all the institutes that has uploaded CSV
adminRouter.get("/institute-list-csv", csvInstituteList);

// for fetching the counts of students, teacher and total count by an institute through CSV
adminRouter.post("/intitute-csv-count", instituteCSVCount);

module.exports = adminRouter;
