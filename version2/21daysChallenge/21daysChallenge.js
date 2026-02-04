const { ImageReduce } = require('../../service/imageSizeReducer');
const { LocalMulter } = require('../../service/localMulter');
const { getAllTask, addTask, updateTask, getTaskById, deleteTask, getAllAttempts, getAttempById, getAllAttemptsByUserId, updateAttempt, deleteAttempt, todaysChallenge, addAttempts, pastChallenge, checkUserAttempt, pastChallengeDetail, submitChallenge, showTaskDetailById, showCredit } = require('./21daysChallenge.controller');

const day21Challenge = require('express')();

// all task routes
day21Challenge.get('/getAllTask',getAllTask)
day21Challenge.post('/addTask',addTask)
day21Challenge.put('/updateTask/:taskId',updateTask)
day21Challenge.get('/getTaskById/:taskId',getTaskById)
day21Challenge.delete('/deleteTask/:taskId',deleteTask)


// user attempts routes
day21Challenge.get('/getAllAttempts',getAllAttempts)
day21Challenge.post('/addAttempts',addAttempts)
day21Challenge.get('/getAllAttemptsByUserId/:userId',getAllAttemptsByUserId)
day21Challenge.get('/getAttempById/:id',getAttempById)
day21Challenge.put('/updateAttempt/:id',updateAttempt)
day21Challenge.delete('/deleteAttempt/:id',deleteAttempt)

// check  user attempt
day21Challenge.get('/checkUserAttempt/:userId/role/:role',checkUserAttempt)

// pastchallenge detail
day21Challenge.get('/pastChallengeDetail/:attemptId/task/:taskId',pastChallengeDetail)

// submit challenge
day21Challenge.post('/submitChallenge/',submitChallenge)

day21Challenge.get('/showTaskDetailById/:attemptId/task/:taskId',showTaskDetailById)

//  challenge
day21Challenge.get('/todaysChallenge/:attemptId',todaysChallenge)
day21Challenge.get('/pastChallenge/:attemptId',pastChallenge)

// show score
day21Challenge.get('/showScore/:attemptId',showCredit)




module.exports = day21Challenge 