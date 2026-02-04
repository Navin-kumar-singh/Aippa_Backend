const {
  studentBulkLogin,
  studentBulkLoginAdminCSV,
  adminFetchCSVList,
  instituteFileUploadStatus,
  downloadInstituteFile,
  getSubadminList,
  assignSubadmin,
  uploadTempInstituteFile,
  getDownloadLink,
  csvInstituteList,
  assignedInstituteList,
} = require("./newCSV.controller");
const { routeVerifierJwt } = require("../auth/jwt");

const newCSVRouter = require("express")();

newCSVRouter.post(
  "/bulklogin",
  // routeVerifierJwt,
  studentBulkLogin
);

newCSVRouter.post(
  "/bulklogin-admin-csv",
  // routeVerifierJwt,
  studentBulkLoginAdminCSV
);

newCSVRouter.get(
  "/fetch-institute-list",
  // routeVerifierJwt,
  csvInstituteList
);

newCSVRouter.post(
  "/fetch-assigned-institute-list",
  // routeVerifierJwt,
  assignedInstituteList
);

newCSVRouter.get(
  "/fetch-list/:instituteId",
  // routeVerifierJwt,
  adminFetchCSVList
);

newCSVRouter.get(
  "/file-status/:instituteId/:role",
  // routeVerifierJwt,
  instituteFileUploadStatus
);

newCSVRouter.get(
  "/download-file/:fileName/:instituteId/:role",
  // routeVerifierJwt,
  downloadInstituteFile
);

newCSVRouter.get(
  "/get-download-link/:instituteId/:role/:fileName",
  // routeVerifierJwt,
  getDownloadLink
);

newCSVRouter.get(
  "/subadmin-list",
  // routeVerifierJwt,
  getSubadminList
);

newCSVRouter.put(
  "/subadmin-assign",
  // routeVerifierJwt,
  assignSubadmin
);

newCSVRouter.post(
  "/institute-file-store/:instituteId/:role",
  // routeVerifierJwt,
  uploadTempInstituteFile
);

module.exports = newCSVRouter;
