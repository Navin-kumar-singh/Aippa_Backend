const express = require("express");
const { instituteRegisterController, instituteAffiliateController, studentRegisterController } = require("./register.controller");
const RegisterRouter = express.Router();

RegisterRouter.post("/institution", instituteRegisterController);
RegisterRouter.post("/student", studentRegisterController);
RegisterRouter.post("/institutionaffiliation", instituteAffiliateController);

module.exports = { RegisterRouter };
