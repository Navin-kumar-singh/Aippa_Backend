const { createDiscussion, getAllUserByInstituId, getAllUsers, getallDiscussion, getDiscussionDetailsById, findOneDiscussDetails, getAttendeeDetail, discussionDetail, closeMeeting,getparticipateUser } = require("./discussion_board.controller");

const discussionBoardRouter = require("express").Router();
// <<============Get all user like student ,teacher ,coordinator etc by his instituteId =============>>
discussionBoardRouter.get('/usersListByRole',getAllUserByInstituId)
discussionBoardRouter.get('/userList',getAllUsers)
// <===========Get all discussion by Institute Id == =======> \\\
discussionBoardRouter.get('/discussion-list/:instituteId' ,getallDiscussion);
discussionBoardRouter.get('/discussionlistById/:discussionId',getDiscussionDetailsById)
discussionBoardRouter.post("/createDiscussion",createDiscussion)

//======== An Api for to find details of created discussion =====\\
discussionBoardRouter.get('/findOneDetails/:user_id',findOneDiscussDetails)

discussionBoardRouter.get('/getAttendeeDetail/user/:userId/role/:role/discussionId/:discussionId',getAttendeeDetail)
discussionBoardRouter.get('/discussionDetail/discussionId/:discussionId',discussionDetail)
discussionBoardRouter.get('/getparticipateUser/instituteId/:instituteId',getparticipateUser)


// delete discussionId
discussionBoardRouter.delete('/delete/discussion/:discussionId', closeMeeting)

module.exports = discussionBoardRouter