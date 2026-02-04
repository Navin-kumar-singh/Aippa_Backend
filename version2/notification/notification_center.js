const {DBMODELS} = require("../../database/models/init-models");
const generateNotification = require("../../service/notificationCenter")

const createNotification = async(req, res)=>{
    const {message, instituteId, userId, recieved, role} = req.body;
    console.log("req*************",req.body.role);
    const {insId, stuId} = req.params;
    // console.log("i--------",insId, "s--------",stuId);
    try {
        const insIdResult = await DBMODELS.institutions.findOne({
            attributes: ['id'],
            where: {
                id: insId,
            }
        });

        const stuIdResult = await DBMODELS.students.findOne({
            attributes: ['id'],
            where: {
                id: stuId,
                // role: 'student',
            }
        });

        if(insIdResult && stuIdResult){
            const notificationMessage = generateNotification("Mun_cord_invitation")
            const createNotify = await DBMODELS.notification_center.create({instituteId, userId, message: notificationMessage, recieved, role});
            if(createNotify){
                await createNotify.update({ recieved: true });
                return res.status(201).json({msg: "Sucessfully created", createNotify});
            }
            else{
                return res.status(404).json({msg: "Not sent"});
            }
        }
    } catch (error) {
        return res.status(500).json({msg: "Server error", error: error.message});
    }
}

const getNotification = async(req, res)=>{
    const {insId, stuId} = req.params;
    console.log(insId, stuId)
    try {
        const getNotify = await DBMODELS.notification_center.findAll({
            where : {
                instituteId: insId,
                userId: stuId,
            }
        })
        // console.log(getNotify)
        if(getNotify){
            return res.status(200).json({msg: "Sussccessfully got notificatin", getNotify})
        }
        else{
            return res.status(404).json({msg: "Not found notification"})
        }
    } catch (error) {
        return res.status(500).json({msg: "Server error", error: error.message})
    }
}


const updateReadStatus = async(req, res)=>{
    const {status} = req.body;
    const {notifyId} = req.params;
    try {
        const updateStatus = await DBMODELS.notification_center.findOne({
            where: {
                id: notifyId,
                status: "unread"
            }
        })
        if(updateStatus){
            await updateStatus.update({status: 'read'})
            return res.status(200).json({msg: "Update successfully", updateStatus});
        }
        else{
            return res.status(400).json({msg: "Not Update", update});
        }
    } catch (error) {
        return res.status(500).json({msg: "Server Error", error: error.message});
    }
}

module.exports = {
    createNotification,
    getNotification,
    updateReadStatus
}