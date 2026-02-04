const express = require('express');
const {modelUnRegister, getEventTheme, getSubTheme, createCommittee, getAllcommittee, createSelectedCommittee, getAllSelectedCommittee, createEventFormat, getEventFormat, createEventCoordinator, getAvailablePosByComId, getNominationDetailByStudentPartId, nominateStudent, getAllCommitee, registrationDetail, checkIfInstituteRegister, getAllUserInstitute, postPressCorpsMember, postCoordinator, postSecretariats, getUNTeam, deleteMember ,getInstituteDetails, addTeacherCoordinator, getAllTeacherCoordinator, deleteTeacherCord, getAllSecretariat, getAllPcData, addSecretariatDetails, getSelectedSecByIns, deleteSelectedSec, addPressCorpDetails, getSelectedPcByIns, deleteSelectedPc, editSecretriat, getEventDetailsWithSlot, EditEventDetailsWithSlots, getAllInstituteReaminingSlotsNew, getSelectedCommittee, betaCheckApplicantUserList, betaFindApplicantTeacher, RejectApplicant} = require("./modelUn_register.controller")

const modelUnRegisterRouter = express.Router();
// register for institute
modelUnRegisterRouter.post("/register/:instituteId", modelUnRegister);
// get event detail
modelUnRegisterRouter.get('/getEventDetail/institute/:instituteId',registrationDetail)
// get available position by comm id
modelUnRegisterRouter.get('/getAvailablePosition/committee/:committeeId/registeration/:registerId', getAvailablePosByComId)
// get all comm
modelUnRegisterRouter.get('/getAllCommitee', getAllCommitee)
// get participateDetail by student id and register id
modelUnRegisterRouter.get('/getParticipateDetail/student/:studentId/register/:registerId',getNominationDetailByStudentPartId)
// nominate student
modelUnRegisterRouter.put('/nominateStudent/student/:studentId/register/:registerId',nominateStudent)

modelUnRegisterRouter.put('/rejectApplicant/student/:studentId/register/:registerId',RejectApplicant)
// check if institute is register
modelUnRegisterRouter.get('/checkIfInstituteRegister/institute/:instituteId', checkIfInstituteRegister)

// get all user related to institute
modelUnRegisterRouter.get('/getAllUser/institute/:instituteId', getAllUserInstitute)

// post coordinatordata useless
modelUnRegisterRouter.post('/postCoordinator', postCoordinator)
modelUnRegisterRouter.post('/postPressCorpsMember', postPressCorpsMember)
modelUnRegisterRouter.post('/postSecretariats', postSecretariats)


// delete modelun member teamRegisteration
modelUnRegisterRouter.delete('/deleteMember/institute/:instituteId/role/:role/id/:id', deleteMember)

// get Un team by instute id
modelUnRegisterRouter.get('/getUNTeam/institute/:instituteId', getUNTeam)


// ====== All coordinator add,delete and getDetails api routes =====
modelUnRegisterRouter.post('/addCoodinator',addTeacherCoordinator);
modelUnRegisterRouter.get('/getAllTeacherCoordinator/:instituteId',getAllTeacherCoordinator)
modelUnRegisterRouter.delete('/deleteCoordinator/:email',deleteTeacherCord)

//======= get all secretariats and Press corp details with slots=============\\
modelUnRegisterRouter.get('/getAllSecDetails/institute/:instituteId/registerId/:registerId',getAllSecretariat)
modelUnRegisterRouter.get('/getAllPcDetails/institute/:instituteId/registerId/:registerId',getAllPcData)

//====== All secretariats post,delete and get details api routes by institute ===============\\
modelUnRegisterRouter.post('/addSecMember',addSecretariatDetails);
//  ====== All secretariat which is selected by institute ======\\
modelUnRegisterRouter.post('/getAllselectSecretariatDetails',getSelectedSecByIns)
//========Delete secretariat member by the institute=======
modelUnRegisterRouter.delete('/deleteSelectSecMember/:email',deleteSelectedSec)
//========Edit secretariat member by the institute=======
modelUnRegisterRouter.put('/editSecMember/:secretariatId',editSecretriat)


//====== All Press Corps post,delete and get details api routes by institute ===============\\
modelUnRegisterRouter.post('/addPcMember',addPressCorpDetails);
modelUnRegisterRouter.get('/getAllselectPcDetails/institute/:instituteId/registerId/:registerId',getSelectedPcByIns)
modelUnRegisterRouter.delete('/deleteSelectPcMember/:email',deleteSelectedPc)

modelUnRegisterRouter.put('/getAllInstituteReaminingSlots/:instituteId/event/:eventId',getAllInstituteReaminingSlotsNew)
//=========  Api route for manage slots and event details  management========\\
modelUnRegisterRouter.get('/getEventDetailsWithSlot/:instituteId',getEventDetailsWithSlot)
//=========Put api for  edit event deatails ====\\
modelUnRegisterRouter.put('/EditEventDetailsWithSlots/:registerId/instituteId/:instituteId',EditEventDetailsWithSlots)
//============= get api for finding commitee which is the selected by the institute =====================\\
modelUnRegisterRouter.get('/getSelectedCommittee/:registerId',getSelectedCommittee)
//===============  New api's for getting student details as participate or not ====================\\
modelUnRegisterRouter.get('/betaCheckApplicantUserList/:instituteId',betaCheckApplicantUserList)
modelUnRegisterRouter.get('/betaFindApplicantTeacher/:instituteId',betaFindApplicantTeacher)

// ================================================================================================



// useless api 
// ==============================================================================

modelUnRegisterRouter.post("/eventformat", createEventFormat);
modelUnRegisterRouter.get("/getformat", getEventFormat);
modelUnRegisterRouter.get("/gettheme", getEventTheme);
modelUnRegisterRouter.get("/getsubtheme", getSubTheme);
modelUnRegisterRouter.post("/create-committee", createCommittee);
modelUnRegisterRouter.get("/getcommittee", getAllcommittee);
modelUnRegisterRouter.post("/create-selected-committee", createSelectedCommittee);
modelUnRegisterRouter.get("/getselected-committee", getAllSelectedCommittee);
modelUnRegisterRouter.post("/create-coordinator/institute/:instituteId", createEventCoordinator);

modelUnRegisterRouter.get("/institute-details/:instituteId", getInstituteDetails);


module.exports= modelUnRegisterRouter 
