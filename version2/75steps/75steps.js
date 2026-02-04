const { ImageReduce } = require('../../service/imageSizeReducer');
const { LocalMulter } = require('../../service/localMulter');
const { getAllAttempts, addAttempts,
     getAllAttemptsByUserId, getAttempById,
      updateAttempt, deleteAttempt, checkUserAttempt, pastChallengeDetail, submitChallenge, todaysChallenge, pastChallenge, getAllTask, addTask, updateTask, getTaskById, deleteTask, getAllCategory, addCategory, updateCategory, getCategoryById, deleteCategory, showCredit
     } = require('./75steps.controller');

const steps75 = require('express')();

// day21Challenge.get('/pastChallenge/:attemptId',pastChallenge)
steps75.get('/getAllCategory',getAllCategory)
steps75.post('/addCategory',addCategory)
steps75.put('/updateCategory/:id',updateCategory)
steps75.get('/getCategoryById/:id',getCategoryById)
steps75.delete('/deleteCategory/:id',deleteCategory)


steps75.get('/getAllTask',getAllTask)
steps75.post('/addTask',addTask)
steps75.put('/updateTask/:taskId',updateTask)
steps75.get('/getTaskById/:taskId',getTaskById)
steps75.delete('/deleteTask/:taskId',deleteTask)


steps75.get('/getAllAttempts',getAllAttempts)

steps75.post('/addAttempts',addAttempts)

steps75.get('/getAllAttemptsByUserId/:userId',getAllAttemptsByUserId)

steps75.get('/getAttempById/:id',getAttempById)

steps75.put('/updateAttempt/:id',updateAttempt)

steps75.delete('/deleteAttempt/:id',deleteAttempt)

// check  user attempt
steps75.get('/checkUserAttempt/:userId/role/:role',checkUserAttempt)

// pastchallenge detail
steps75.get('/pastChallengeDetail/:attemptId/task/:taskId',pastChallengeDetail)

// submit challenge
steps75.post('/submitChallenge/',submitChallenge)


//  challenge
steps75.get('/todaysChallenge/:attemptId',todaysChallenge)

steps75.get('/pastChallenge/:attemptId',pastChallenge)


// get score

steps75.get('/showScore/:attemptId',showCredit)


module.exports = steps75