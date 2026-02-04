const express = require("express")
const { createNotification, getNotification, updateReadStatus } = require("./notification_center")

const notificationRouter = express.Router();

// create notification
notificationRouter.post("/createNotify/:insId/:stuId", createNotification)
notificationRouter.get("/getNotify/:insId/:stuId", getNotification)
notificationRouter.put("/updateStatus/:notifyId", updateReadStatus)

module.exports = notificationRouter