const {routeVerifierJwt} = require("../auth/jwt");
const {
  fetchDiscussionPoints,
  DiscussionVotesController,
  checkIsAssigned,
  instituteFindMeetings,
  fetchSelfVotes,
  fetchLeaderBoard,
  instituteStatusUpdater,
  instituteStatusChecker,
  instituteEventStart,
  instituteEventDelete,
  instituteDeclarationEventStart,
  fetchDeclarationLeaderBoard,
  fetchCommunique,
  editStudentPoint,
  deleteStudentPoint,
  reportStudentPoint,
  fetchCommuniqueReport,
} = require("./discussion.controller");
const discussionRouter = require("express").Router();
discussionRouter.get("/points", routeVerifierJwt, fetchDiscussionPoints);
discussionRouter.post(
  "/points/vote",
  routeVerifierJwt,
  DiscussionVotesController
);
discussionRouter.get("/points/leaderboard", routeVerifierJwt, fetchLeaderBoard);
discussionRouter.get("/points/vote", routeVerifierJwt, fetchSelfVotes);
discussionRouter.put("/points/edit", routeVerifierJwt, editStudentPoint);
discussionRouter.put("/points/delete", routeVerifierJwt, deleteStudentPoint);
discussionRouter.put("/points/report", routeVerifierJwt, reportStudentPoint);
discussionRouter.post("/update", routeVerifierJwt, instituteStatusUpdater);
discussionRouter.post("/check", routeVerifierJwt, instituteStatusChecker);
discussionRouter.post("/start", routeVerifierJwt, instituteEventStart);
discussionRouter.post("/delete", routeVerifierJwt, instituteEventDelete);
discussionRouter.post(
  "/declaration",
  routeVerifierJwt,
  instituteDeclarationEventStart
);
discussionRouter.post(
  "/declaration/leaderboard",
  routeVerifierJwt,
  fetchDeclarationLeaderBoard
);
discussionRouter.post("/meetings", routeVerifierJwt, instituteFindMeetings);
discussionRouter.post("/assigncheck", routeVerifierJwt, checkIsAssigned);
discussionRouter.post("/communique", routeVerifierJwt, fetchCommunique);
discussionRouter.post("/communique-report", routeVerifierJwt, fetchCommuniqueReport);

module.exports = discussionRouter;
