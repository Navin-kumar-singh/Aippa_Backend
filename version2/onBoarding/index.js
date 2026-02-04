const { routeVerifierJwt } = require("../../routes/auth/jwt");
const { checkDuplicateInstitute } = require("./onBoard.controller");

const onBoardV2Router = require("express").Router();

onBoardV2Router.get("/checkDuplicateInstitute", checkDuplicateInstitute);






module.exports = onBoardV2Router;
