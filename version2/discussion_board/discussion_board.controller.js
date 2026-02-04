const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");
const sendEmailService = require("../../service/email");
const sequelize = require("../../database/connection");
const { where } = require("sequelize");

async function getAllUserByInstituId(req, res) {
    const { instituteId, role } = req.query;
    let users;
    try {
        // ========= Get the all user  if it is find  institueId  and role  =========== \\
        if (instituteId && role) {
            users = await DBMODELS.students.findAll({ attributes: [ [sequelize.col('id'),'value'], 
            'first_name', 'last_name', 'email', 'role', 'profile', 'instituteId'], where: { instituteId: instituteId, role: role } });
        } else {
            users = await DBMODELS.students.findAll({ attributes: [[sequelize.col('id'),'value'], 'first_name', 'last_name', 'email', 'role', 'profile', 'instituteId'], where: { instituteId: instituteId } })
        }
        return res.json({
            message: "fetched all",
            allUsers: users
        });
    } catch (error) {
        logg.error(error);
        res.status(500).json({ message: "Internal server error" });
    }

}
//========= Get all user if user without role ===========\\
async function getAllUsers(req, res) {
    const { instituteId } = req.query;
    let userList = await DBMODELS.students.findAll({ attributes: [[sequelize.col('id'),'value'], 'first_name', 'last_name', 'email', 'role', 'profile', 'instituteId'], where: { instituteId: instituteId } })
    return res.status(200).json({
        message: "All user data fetch.",
        userList
    })
}

// ============== Create discussion function ============== \\
async function createDiscussion(req, res) {

    try {
        const { role, userId, instituteId } = req.query
        const { discTitle, eventDate, eventSTime, eventETime, eventName, event_id,event_name,type,committeeType, attendees } = req.body
        const discussion = await DBMODELS.discussion_board.create({
            discussion_title: discTitle,
            start_date: eventDate,
            start_time: eventSTime,
            end_time: eventETime,
            event_id: event_id,
            user_role: role,
            user_id: userId,
            institute_id: instituteId,
            event_name: eventName,
            type,committeeType
        })
        ///========After create discusssion get the Discussion Id =======\\
        const discussionId = discussion.id;
        /// <======== Mapping the attendees where we get the  atendeesId and attendees role for store in the atttendees table  =====//
        const discussionAttendees = attendees.map((attendee) => ({
            discussion_id: discussionId,
            user_id: attendee.value,
            role: attendee.role,
            institute_id:instituteId,
            attend_type:attendee?.attend_type
        }));
        if(discussionId){
            attendees?.map((i)=>{
                const discussionLink = `${process.env.FRONTEND_URL || "http://localhost:3000/"}new-dashboard/discussion-chat-room/${discussionId}`;
          const replacements = {
            name: i?.name ,
            date:eventDate,
            discussion_title: discTitle,
            discussionLink,
          };
          
          let mailConfig = {
            email: i?.email,
            subject: "Scheduling a Model UN Strategy Meeting.",
          };
          sendEmailService.sendTemplatedEmail(
            mailConfig,
            replacements,
            "DISCUSSION_LINK"
          );
            })
        }
        // <========== After create the discussion create bulk attendees======>
        const arrAttenddess = await DBMODELS.discussion_attendees.bulkCreate(discussionAttendees);
        return res.status(201).json({
            message: "Discussion  created successfully.",
            success: true,
            discussion: discussion,
            attendees: arrAttenddess
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message,
            success: false,
        });
    }


}
// ============= Get all discussion List  function  ============ \\
async function getallDiscussion(req, res) {
    const { instituteId } = req.params
    try {
        if (!instituteId) {
            return res.status(404).json({
                success: false,
                message: "InstituteId not found"
            })
        }

        //=========== Check the institutuId is exist or not ======= \\
        const existInstituteId = await DBMODELS.discussion_board.findOne({
            where: {
                institute_id: instituteId
            }
        })
        // ============  Find all discussion List if institute id is exist ======= \
        if (existInstituteId) {

            const allDiscussion = await DBMODELS.discussion_board.findAll({
                where: {
                    institute_id: instituteId
                }
            })
            return res.status(200).json({
                message: true,
                allDiscussion
            })
        } else {
            return res.json({
                message: "Institute id is not found.",
                success: false
            })
        }


    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

// =========== GetOne discussion by id  ============= \\
async function getDiscussionDetailsById(req, res) {
    const { discussionId } = req.params;
    try {
        if (!discussionId) {
            return res.status(404).json({
                message: "Discussion Id is  not  fonud",
                status:false
            })
        }
        const discussDetails = await DBMODELS.discussion_board.findOne({
            where:{
                id:discussionId
            }
        })
        if(!discussDetails){
            return res.status(404).json({
                message:"Discussion Details is not found",
                status:false
            })
        }
        return res.status(200).json({
            message:"Discussion Details find.",
            status:true,
            discussDetails
        })

    } catch (error) {
     console.log(error?.data?.message);
     return res.status(500).json({
        message:error?.data?.message,
        status:false

     }) 
    }

}

//============== Get one discussion details base on the user_id =======\\
const findOneDiscussDetails =async(req,res)=>{
    const {user_id} = req?.params
    try {
      const DisCussDetails = await DBMODELS.discussion_board.findOne({
        where:{
            user_id
        }
      }) 
      return res.json({
        message:"data is found.",
        DisCussDetails
      }) 
    } catch (error) {
       console.log(error?.message) 
       return res.json({
        message:error.message
       })
    }
}

const getAttendeeDetail = async(req,res)=>{
    const {userId, role, discussionId} = req.params

    try {
        const attendeeDetail = await DBMODELS.discussion_attendees.findOne({
            where :{
                role, user_id:userId, discussion_id:discussionId
            },attributes:[
                'attend_type',
                [sequelize.literal(`(
                    select concat(first_name, ' ', last_name) as name
                    from students 
                    where students.id = discussion_attendees.user_id
                )`),'name']
            ]
        })
        return res.json({
            message:'Success',
            result:attendeeDetail,
        })
    } catch (error) {
        return res.error({
            message:'Internal Server Error', 
            result:error.message
        })
    }
}


const discussionDetail = async(req,res)=>{
    const { discussionId} = req.params

    try {
        const discussionDetail = await DBMODELS.discussion_board.findOne({
            where :{
                id:discussionId,
            },attributes:[
                'id', 'discussion_title', 'event_id',
                 'user_role', 'user_id', 'institute_id',
                 'type', 
                 'committeeType', 
                 'event_name'
            ]
        })
        return res.json({
            message:'Success',
            result:discussionDetail,
        })
    } catch (error) {
        return res.error({
            message:'Internal Server Error', 
            result:error.message
        })
    }
}

const getparticipateUser = async(req,res)=>{
    const {instituteId} = req.params
    try {
        const result = await DBMODELS.model_un_student_part.findAll({
            where:{
              instituteId  
            },
            attributes:[

                'instituteId',
                [sequelize.col('studentId'),'value'],
                [sequelize.literal(`(select first_name from students where students.id = model_un_student_part.studentId)`),'first_name'],
                [sequelize.literal(`(select last_name from students where students.id = model_un_student_part.studentId)`),'last_name'],
                [sequelize.literal(`(select role from students where students.id = model_un_student_part.studentId)`),'role'],
                [sequelize.literal(`(select profile from students where students.id = model_un_student_part.studentId)`),'profile'],
                'status','nominationType','is_participant'

        ]
        })
        return res.status(200).json({
            success:false,
            message:"Data found.",
            result
        })
    } catch (error) {
        console.log(error)
    }
}
const closeMeeting = async (req, res) => {
  const { discussionId } = req.params;
  try {
    const endMeeting = await DBMODELS.discussion_board.destroy({
      where: {
        id: discussionId,
      },
    });
    return res.status(200).json({ msg: "End meeting successfully", endMeeting });
  } catch (error) {
    return res.status(200).json({ msg: "Server error", error: error.message });
  }
};

module.exports = {
    createDiscussion,
     getAllUserByInstituId, 
    getAllUsers,
     getallDiscussion,
    getDiscussionDetailsById,
    findOneDiscussDetails,
    getAttendeeDetail,
    discussionDetail,
    getparticipateUser,
    closeMeeting
}