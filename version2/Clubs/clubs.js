const { getAllClubMemberByClubId, checkIfUserJoined, joinClub, leftClub } = require("./clubs.controller");

const clubV2Router = require("express").Router();
clubV2Router.get('/getAllClubMemberByClubId/:clubId/memberDetail',getAllClubMemberByClubId)


clubV2Router.get('/checkIfUserJoined/:clubId/user/:userId/role/:role/checkUser',checkIfUserJoined)
clubV2Router.post('/joinClub/:clubId/user/:userId/role/:role/instituteId/:instituteId/joinClub',joinClub)
clubV2Router.get('/leftClub/:clubId/user/:userId/role/:role/leftClub',leftClub)




module.exports = clubV2Router