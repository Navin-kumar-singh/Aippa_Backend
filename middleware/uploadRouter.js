/* middleware testing routes */
const uploadRouter = require("express").Router();
const upload = require('./testing/upload')
const temp = require('./testing/temp')

uploadRouter.post('/', upload.single('img'), temp)
module.exports = uploadRouter;