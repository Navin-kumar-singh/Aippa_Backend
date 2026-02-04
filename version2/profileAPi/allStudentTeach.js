const express = require("express");
const { getAllStudentTeacher } = require("./profileallRoles");


const profileAllRoleRouter = express.Router();

profileAllRoleRouter.get("/getAllFriendTeacher/:instituteId", getAllStudentTeacher)

module.exports =  {
    profileAllRoleRouter
}