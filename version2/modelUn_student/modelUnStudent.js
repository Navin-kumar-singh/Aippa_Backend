const express = require("express");
const { studentParticipation,
     getAllStudentParticipates,
      getAllCommitteeWithApplicants,
       getStudentParticipatesByInstituteId,
       getEventDetails,
       getPressCorpsDetails,
       getSecretariotDetails,
       getStudentParticipates,
       updateEventDate,
     //   getTotalDelegateSlot,
       getAllSelectCandidateByRole,
       getAllCommitteeWithApplicantsNew,
       getStudentParticipatesNew,
       getApplicantDetails,
       getNipamCertificate
     } = require("./modelUnStudent.controller");
const ModelUnStudentRouter = express.Router();

// participate student
ModelUnStudentRouter.post("/participate", studentParticipation);
// student participate detail
ModelUnStudentRouter.get("/getStudentParticipates/student/:studentId", getStudentParticipates);
//========= Get total available slots in delegates,presscorp ,secretariat ===========\\
// ModelUnStudentRouter.get("/getAvailableDelgateslot/student/:instituteId", getTotalDelegateSlot);
// get all participate
ModelUnStudentRouter.get("/getAllParticipates", getAllStudentParticipates);
// get all selected comm by institute id
ModelUnStudentRouter.get("/getAllCommittee/:instituteId", getAllCommitteeWithApplicants);
ModelUnStudentRouter.get("/getAllCommitteenew/:instituteId", getAllCommitteeWithApplicantsNew);
// get all studentdetail by institute id
ModelUnStudentRouter.get("/getAllStudentsDetail/:instituteId", getStudentParticipatesByInstituteId);
ModelUnStudentRouter.get("/getAllStudentsDetailNew/:instituteId", getStudentParticipatesNew);

// get event detail by institute id 
ModelUnStudentRouter.get('/getEventDetails/institute/:instituteId',getEventDetails)
ModelUnStudentRouter.put('/updateEventDetails/institute/:instituteId',updateEventDate)

// get pressCorps detail by register id
ModelUnStudentRouter.get('/getPressCorpsDetails/register/:registerId',getPressCorpsDetails)
// get secretariats detail by register id
ModelUnStudentRouter.get('/getSecretariotDetails/register/:registerId', getSecretariotDetails)
ModelUnStudentRouter.get('/getAllSelectCandidateByRole/:instituteId',getAllSelectCandidateByRole)

//========= Api  for showing designation role  ================ \\
ModelUnStudentRouter.get('/getApplicantDetails/:studentId',getApplicantDetails)
ModelUnStudentRouter.get('/getNipamCertificate/:studentId',getNipamCertificate)



module.exports = { ModelUnStudentRouter };
