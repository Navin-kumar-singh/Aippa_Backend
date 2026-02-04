const { getAllQuestion, getAttempt, postAttempt, lsmtResult, studentBasedOnClass, testAttendees, parentEmailResult, getFeedbackData, handleFeedback } = require('./lsmtTest.controller');

const lsmtRouter = require("express")();

// geting all the questions
lsmtRouter.get("/allQuestion", getAllQuestion);

// user attempt
lsmtRouter.get('/getAttempt/:userId/:role',getAttempt);
// lsmtRouter.get('/getAttemptById/:userId/:role',getAttemptById);
lsmtRouter.post('/postAttempt',postAttempt);


// Api for sending lsmt test result
lsmtRouter.get('/lsmt-result/:userId', lsmtResult);

// Api for lsmt attendees and non-attendees list
lsmtRouter.post('/lsmt-attempt-status', testAttendees);

// Api for student based on the class
// lsmtRouter.post('/lsmt-careers', studentBasedOnClass);

// Api for sending email user's test result to parents
lsmtRouter.get('/lsmt-result-email/:studentId', parentEmailResult);

// lsmt feedback from teacher and institute storing into database
lsmtRouter.post('/riasec-student-feedback', handleFeedback);

// Fetching all feedbacks
lsmtRouter.get("/lsmt-feedbacks/:studentId", getFeedbackData);


module.exports = lsmtRouter;