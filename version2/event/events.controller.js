const { Op } = require("sequelize");
const sequelize = require("../../database/connection")
const { DBMODELS } = require("../../database/models/init-models")





const getCalEvent = async (req, res) => {
    const { userId, role } = req.params;
    const currentDate = new Date();
    try {
        const events = await DBMODELS.cal_events.findAll({

            attributes: [
                'id', 'title', 'startTime',
                'startDate', 'endTime',
                'endDate', 'thumbnail', 'location', 'userId', 'role' ,
                [sequelize.literal(`(
                    select count(*)
                    from cal_events_users ce
                    where ce.eventId = cal_events.id and ce.activity_type = 'going'
                )`), 'going'],
                [sequelize.literal(`(
                    select count(*)
                    from cal_events_users ce
                    where ce.eventId = cal_events.id and ce.activity_type = 'interested'
                )`), 'interested'],
                [sequelize.literal(`(
                  COALESCE(  (select concat(s.first_name,  s.last_name) as name
                    from students s 
                    where s.id = cal_events.userId and (cal_events.role = 'student' or cal_events.role='teacher')),

                    (select (i.institution_name) 
                    from institutions i
                    where i.id = cal_events.userId and cal_events.role = 'institute'))
                )`), 'by'],
                [sequelize.literal(`(
                    select count(*)
                    from cal_events_users as ce
                    where ce.userId = ${userId} and ce.role = '${role}' and ce.activity_type ='interested'  and ce.eventId=cal_events.id
                )`), 'isInterested'],
                [sequelize.literal(`(
                    select count(*)
                    from cal_events_users as ce
                    where ce.userId = ${userId} and ce.role = '${role}' and ce.activity_type ='going' and ce.eventId=cal_events.id
                )`), 'isGoing'],
            ],
            order: [
                ['startDate', 'ASC'],
                ['startTime', 'ASC']
            ]
        })
        return res.json({
            result: events
        })

    } catch (error) {
        console.log('error', error)
        return res.json({
            error: error.message
        })
    }
}

const getFavEvent = async (req, res) => {
    const { userId, role } = req.params;
    try {
        const events = await DBMODELS.cal_events.findAll({
            where: {
                id: {
                    [Op.in]: sequelize.literal(`(
                        SELECT DISTINCT eventId 
                        FROM cal_events_users 
                        WHERE userId = ${userId} 
                        AND role = '${role}' 
                        AND activity_type IN ('going', 'interested')
                    )`)
                }
            },
            attributes: [
                'id', 'title', 'startTime',
                'startDate', 'endTime',
                'endDate', 'thumbnail', 'location', 'userId', 'role' ,
                [sequelize.literal(`(
                    select count(*)
                    from cal_events_users ce
                    where ce.eventId = cal_events.id and ce.activity_type = 'going'
                )`), 'going'],
                [sequelize.literal(`(
                    select count(*)
                    from cal_events_users ce
                    where ce.eventId = cal_events.id and ce.activity_type = 'interested'
                )`), 'interested'],
                [sequelize.literal(`(
                  COALESCE(  (select concat(s.first_name, s.last_name) as name
                    from students s 
                    where s.id = cal_events.userId and (cal_events.role = 'student' or cal_events.role='teacher')),

                    (select (i.institution_name) 
                    from institutions i
                    where i.id = cal_events.userId and cal_events.role = 'institute'))
                )`), 'by'],
                [sequelize.literal(`(
                    select count(*)
                    from cal_events_users as ce
                    where ce.userId = ${userId} and ce.role = '${role}' and ce.activity_type ='interested'  and ce.eventId=cal_events.id
                )`), 'isInterested'],
                [sequelize.literal(`(
                    select count(*)
                    from cal_events_users as ce
                    where ce.userId = ${userId} and ce.role = '${role}' and ce.activity_type ='going' and ce.eventId=cal_events.id
                )`), 'isGoing'],
            ],
            order: [
                ['startDate', 'ASC'],
                ['startTime', 'ASC']
            ]
        })
        return res.json({
            message: 'success',
            result: events
        })
    } catch (error) {
        return res.json({
            error: error.message
        })
    }

}

const getEventById = async (req, res) => {
    const { userId, role, eventId } = req.params;
    const currentDate = new Date();
    try {
        const events = await DBMODELS.cal_events.findOne({
            where: {
                id: eventId
            },
            attributes: [
                'id', 'title', 'startTime',
                'startDate', 'endTime',
                'endDate', 'thumbnail', 'location',
                [sequelize.literal(`(
                    select count(*)
                    from cal_events_users ce
                    where ce.eventId = cal_events.id and ce.activity_type = 'going'
                )`), 'going'],
                [sequelize.literal(`(
                    select count(*)
                    from cal_events_users ce
                    where ce.eventId = cal_events.id and ce.activity_type = 'interested'
                )`), 'interested'],
                [sequelize.literal(`(
                  COALESCE(  (select concat(s.first_name,  s.last_name) as name
                    from students s 
                    where s.id = cal_events.userId and (cal_events.role = 'student' or cal_events.role='teacher')),

                    (select (i.institution_name) 
                    from institutions i
                    where i.id = cal_events.userId and cal_events.role = 'institute'))
                )`), 'by'],
                [sequelize.literal(`(
                    select count(*)
                    from cal_events_users as ce
                    where ce.userId = ${userId} and ce.role = '${role}' and ce.activity_type ='interested'  and ce.eventId=cal_events.id
                )`), 'isInterested'],
                [sequelize.literal(`(
                    select count(*)
                    from cal_events_users as ce
                    where ce.userId = ${userId} and ce.role = '${role}' and ce.activity_type ='going' and ce.eventId=cal_events.id
                )`), 'isGoing'],
                [sequelize.literal(`(
                    select COUNT(DISTINCT ce.userId)
                    from cal_events_users as ce
                    where ce.eventId=${eventId}
                )`), 'responded'],
            ],
            order: [
                ['startDate', 'ASC'],
                ['startTime', 'ASC']
            ]
        })
        return res.json({
            result: events
        })

    } catch (error) {
        console.log('error', error)
        return res.json({
            error: error.message
        })
    }
}

const createEvents = async (req, res) => {
    const body = req.body;
    try {
        // console.log("body", body)
        const event = await DBMODELS.cal_events.create(body)

        return res.json({
            message: 'Created Successfully',
            result: event
        })
    } catch (error) {
        return res.json({
            error: error.message
        })
    }
}

const createEventActivityUser = async (req, res) => {
    const body = req.body;
    try {
        const userActivity = await DBMODELS.cal_events_users.create(body)

        return res.json({
            message: 'Created Successfully',
            result: userActivity
        })
    } catch (error) {
        return res.json({
            error: error.message
        })
    }
}

const handleIsGoing = async (req, res) => {
    const { userId, role, eventId } = req.params
    try {
        const check = await DBMODELS.cal_events_users.findOne({
            where: {
                userId, role, eventId, activity_type: "going"
            }
        })
        if (!check) {
            const add = await DBMODELS.cal_events_users.create({ userId, role, eventId, activity_type: 'going' })
            if (add) {
                return res.json({
                    message: "added success"
                })
            }
        } else {
            const del = await DBMODELS.cal_events_users.destroy({
                where: {
                    userId, role, eventId, activity_type: "going"
                }
            })
            return res.json({
                message: 'remove success'
            })
        }
    } catch (error) {
        return res.json({
            error: error.message
        })
    }
}
const handleinterested = async (req, res) => {
    const { userId, role, eventId } = req.params
    try {
        const check = await DBMODELS.cal_events_users.findOne({
            where: {
                userId, role, eventId, activity_type: "interested"
            }
        })
        if (!check) {

            const add = await DBMODELS.cal_events_users.create({ userId, role, eventId, activity_type: 'interested' })
            if (add) {
                return res.json({
                    message: "success"
                })
            }
        } else {
            const del = await DBMODELS.cal_events_users.destroy({
                where: {
                    userId, role, eventId, activity_type: "interested"
                }
            })
            return res.json({
                message: 'remove success'
            })
        }
    } catch (error) {
        return res.json({
            error: error.message
        })
    }
}
// post controller 

const createPost = async (req, res) => {
    const body = req.body;

    try {
        const post = await DBMODELS.cal_events_posts.create(body)
        return res.json({
            result: post
        })

    } catch (error) {
        console.log('error', error)
        return res.json({
            error: error.message
        })
    }
}

const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await DBMODELS.cal_events_posts.findOne({
            where: {
                id,
            },
            attributes: [
                'id',
                'userId', 'instituteId', 'role', 'text', 'eventId', 'img', 'createdAt', 'updatedAt',
                [sequelize.literal('122'), 'likes'],
                [sequelize.literal('111'), 'comments'],

            ],
            order: ['createdAt', 'DESC']
        })
        return res.json({
            result: post
        })

    } catch (error) {
        console.log('error', error)
        return res.json({
            error: error.message
        })
    }
}
const deleteEventPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await DBMODELS.cal_events_posts.destroy({
            where: {
                id,
            },

        })
        return res.json({
            message: 'success',
            result: post
        })

    } catch (error) {
        console.log('error', error)
        return res.json({
            error: error.message
        })
    }
}
const deleteMyEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await DBMODELS.cal_events.destroy({
            where: {
                id,
            },

        })
        return res.json({
            message: 'success',
            result: post
        })

    } catch (error) {
        console.log('error', error)
        return res.json({
            error: error.message
        })
    }
}

const updateEventPost = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    try {
        const post = await DBMODELS.cal_events_posts.update(body,{
            where: {
                id,
            },
        })
        return res.json({
            message: "success",
            result: post
        })

    } catch (error) {
        console.log('error', error)
        return res.json({
            error: error.message
        })
    }
}
// REUSABLE ATTRIBUTE FOR POSTS
const commonPostAttribute = [
    'id',
    'userId', 'instituteId', 'role', 'text', 'eventId', 'img', 'createdAt', 'updatedAt','videoId',
    [sequelize.literal(`(
        COALESCE(
            (
                SELECT s.profile
                FROM students s
                WHERE s.id = cal_events_posts.userId AND s.role = cal_events_posts.role COLLATE utf8mb4_general_ci
            ),
            (
                SELECT i.logo
                FROM institutions i
                WHERE i.id = cal_events_posts.userId COLLATE utf8mb4_general_ci
            )
        )
    )`), 'profile'],
    [sequelize.literal(`(
        COALESCE(
            (
                SELECT concat(s.first_name, s.last_name) as name
                FROM students s
                WHERE s.id = cal_events_posts.userId AND s.role = cal_events_posts.role COLLATE utf8mb4_general_ci
            ),
            (
                SELECT i.institution_name
                FROM institutions i
                WHERE i.id = cal_events_posts.userId COLLATE utf8mb4_general_ci
            )
        )
    )`), 'name'],
    [sequelize.literal(`(
        select count(*)
        from cal_events_comments cec
        where cec.postId = cal_events_posts.id
    )`), 'comments'],

    [sequelize.literal(`(
        select count(*)
        from cal_events_likes cec
        where cec.postId = cal_events_posts.id
    )`), 'likes'],
    
    
    [sequelize.literal(`(
        select startTime
        from cal_events
        where cal_events_posts.eventId = cal_events.id 
    )`), 'eventStartTime'],
    [sequelize.literal(`(
        select startDate
        from cal_events
        where cal_events_posts.eventId = cal_events.id 
    )`), 'eventStartDate'],

    [sequelize.literal(`(
        select count(*)
        from cal_events_users ce
        where ce.eventId = cal_events_posts.eventId and ce.activity_type = 'interested'
    )`), 'interested'],

    [sequelize.literal(`(
                  COALESCE(  (select concat(s.first_name,  s.last_name) as name
                    from students s 
                    where s.id = cal_events_posts.userId and (cal_events_posts.role = 'student' or cal_events_posts.role='teacher')),

                    (select (i.institution_name) 
                    from institutions i
                    where i.id = cal_events_posts.userId and cal_events_posts.role = 'institute'))
                )`), 'eventBy'],

    [sequelize.literal(`(
        select title
        from cal_events
        where cal_events_posts.eventId = cal_events.id 
    )`), 'eventTitle'],
]

const getAllPost = async (req, res) => {
    try {
        const post = await DBMODELS.cal_events_posts.findAll({
            attributes: commonPostAttribute,
            order: [['createdAt', 'desc']]
        });
        return res.json({
            result: post
        });
    } catch (error) {
        console.log('error', error);
        return res.json({
            error: error.message
        });
    }
};


const getAllUserPost = async (req, res) => {
    const { userId, role } = req.params;
    try {
        const post = await DBMODELS.cal_events_posts.findAll({
            where: {
                userId, role
            },
            attributes: commonPostAttribute,
            order: [['createdAt', 'desc']]
        })
        return res.json({
            result: post
        })

    } catch (error) {
        console.log('error', error)
        return res.json({
            error: error.message
        })
    }
}

const getAllInstitutePost = async (req, res) => {
    const { instituteId } = req.params;
    try {
        const post = await DBMODELS.cal_events_posts.findAll({
            where: {
                instituteId
            },
            attributes: commonPostAttribute,
            order: [['createdAt', 'desc']]
        })
        return res.json({
            result: post
        })

    } catch (error) {
        console.log('error', error)
        return res.json({
            error: error.message
        })
    }
}

const getAllPostByEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
        const post = await DBMODELS.cal_events_posts.findAll({
            where: {
                eventId
            },
            attributes: commonPostAttribute,
            order: [['createdAt', 'desc']]
        })
        return res.json({
            result: post
        })

    } catch (error) {
        console.log('error', error)
        return res.json({
            error: error.message
        })
    }
}

// COMMENTS ATTRIBUTES
const commenCommenttAtribute = [
    'id',
    'userId', 'instituteId', 'role', 'text', 'createdAt', 'updatedAt',
    [sequelize.literal(`(
        COALESCE(
            (
                SELECT s.profile
                FROM students s
                WHERE s.id = cal_events_comments.userId AND s.role = cal_events_comments.role COLLATE utf8mb4_general_ci
            ),
            (
                SELECT i.logo
                FROM institutions i
                WHERE i.id = cal_events_comments.userId COLLATE utf8mb4_general_ci
            )
        )
    )`), 'profile'],
    [sequelize.literal(`(
        COALESCE(
            (
                 SELECT concat(s.first_name, s.last_name)
                FROM students s
                WHERE s.id = cal_events_comments.userId AND s.role = cal_events_comments.role COLLATE utf8mb4_general_ci
            ),
            (
               SELECT i.institution_name
                FROM institutions i
                WHERE i.id = cal_events_comments.userId COLLATE utf8mb4_general_ci
            )
        )
    )`), 'name'],

]

const addComment = async(req,res)=>{
    const body = req.body;
    console.log(body)
    try {

        const comment = await DBMODELS.cal_events_comments.create(body);

        return res.json({
            message:'success',
            result:comment
        })
    } catch (error) {
        return res.json({
            error:error.message
        })
    }
}

const addLikes = async(req,res)=>{
    const body = req.body;
    try {

        const check = await DBMODELS.cal_events_likes.count({
            where:{
                userId:body?.userId
            }
        })
        if(check){
            const likes = await DBMODELS.cal_events_likes.destroy({
                where:{
                    userId:body?.userId
                }
            })
            return res.json({
                message:'Remove Like'
            })
        }
        
        else{
            const likes = await DBMODELS.cal_events_likes.create(body);
            return  res.json({
                message:"succesfully added",
                result:likes
            })
        }
    } catch (error) {
        return res.json({
            error:error.message
        })
    }
}

const getAllCommentsByPost = async(req,res)=>{
    const {postId} = req.params;
    try {
        const comments = await DBMODELS.cal_events_comments.findAll({
            where:{
                postId
            },
            attributes:commenCommenttAtribute,
            order:[["createdAt","DESC"]]
        })
        return res.json({
            result:comments
        })
    } catch (error) {
        return res.json({
            error:error.message
        })
    }
}

const autogeneratedPostForInterested = async(req,res)=>{
    const {body} = req.body;

    try {   
        const post = await DBMODELS.cal_events_posts.create(body)
        return res.json({
            message:'Success',
            result:post
        })
    } catch (error) {
        return res.json({
            message:'error',
            error:error.message
        })
    }
}

const checkPostLike = async(req,res)=>{
    const {postId,userId,role} = req.params
    try {
         const check = await DBMODELS.cal_events_likes.count({
            where:{
                postId,userId,role
            }
         })
         return res.json({
            message:'fetched',
            result:check
         })
    } catch (error) {
        return res.json({
            error:error.message
        })
    }
}

const deleteComment = async(req,res)=>{
    const {id} = req.params;
    try {
        const deleteComment = await DBMODELS.cal_events_comments.destroy({
            where:{
                id:id
            }
        })
        return res.json({
            message:'succesfully deleted', 
        })
    } catch (error) {
        return res.json({
            message:'error',
            error:error.message
        })
    }
}


const generateEventPost = async(req,res)=>{
    const body = req.body;
    console.log(`body`, body)
    try {

        const isPostExist = await DBMODELS.cal_events_posts.count({
            where:{
                userId:body.userId,
                role:body.role,
                post_type:'eventInterested',
                post_type_id:body.post_type_id
            }
        })
       if(!isPostExist){
        const post = await DBMODELS.cal_events_posts.create(body)

        return res.json({
            message:'success created',
            result:post
        })
       }
       return res.json({
           message:'post already exist',
           result:isPostExist
       })
    } catch (error) {   
        return res.json({
            error:error.message
        })
    }
}

const getAllInterestedPostByInstituteId = async(req,res)=>{
    const {instituteId} = req.params;
    try {
        const posts = await DBMODELS.cal_events_posts.findAll({
            where:{
                instituteId:instituteId,
                post_type:'eventInterested',
                
            },attributes:commonPostAttribute
        })
        return res.json({
            message:'success',
            result:posts
        })
    } catch (error) {
        return res.json({
            error:error.message
        })
    }
}

const riasecLeaderBoardByInsituteId = async(req,res)=>{
    const {instituteId} = req.params;
   
    const studentIdArray = [];
    try {
        const students = await DBMODELS.students.findAll({
            attributes: ['id'],
            where: {
                instituteId: instituteId
            }
        });
        students.forEach(student => {
            studentIdArray.push(student.id);
        });

        const riasecUser = await DBMODELS.riasecAttempt.findAll({
            where: {
                studentId: {
                    [Op.in]: studentIdArray
                }
            }
        })
        return res.json({
            message: 'success',
            result: riasecUser
        });
    } catch (error) {
        return res.json({
            error: error.message
        });
    }

}


const day21LeaderBoardByInsituteId = async(req,res)=>{
    const {instituteId} = req.params;
    try {
        const leaderBoard = await DBMODELS.days_21_attempt.findAll({
            where: {
                instituteId: instituteId
            },
            attributes:[
                [sequelize.literal(`(
                    select concat(first_name,  last_name) as name
                    from students
                    where students.id = days_21_attempts.userId
                )`),'name'],
                'point_earned',
            ],
            order: [['point_earned', 'DESC']]
        })
    } catch (error) {
        return res.json({
            error: error.message
        });
    }
}


const step75LeaderBoardByInsituteId = async(req,res)=>{
    const {instituteId} = req.params;
    try {
        const leaderBoard = await DBMODELS.steps_75_attempt.findAll({
            where: {
                instituteId: instituteId
            },
            attributes:[
                [sequelize.literal(`(
                    select concat(first_name, last_name) as name
                    from students
                    where students.id = steps_75_attempt.userId
                )`),'name'],
                'point_earned',
            ],
            order: [['point_earned', 'DESC']]
        })
    } catch (error) {
        return res.json({
            error: error.message
        });
    }
}
   
   






module.exports = {
    getAllInterestedPostByInstituteId,
    generateEventPost,
    deleteComment,
    autogeneratedPostForInterested,
    checkPostLike,
    addLikes,
    addComment,
    getAllCommentsByPost,
    getFavEvent,
    getCalEvent,
    createEvents,
    createEventActivityUser,
    handleIsGoing,
    handleinterested,
    getEventById,
    createPost,
    getPostById,
    getAllPost,
    deleteEventPost,
    updateEventPost,
    getAllUserPost,
    getAllInstitutePost,
    getAllPostByEvent,
    getAllUserPost,
    deleteMyEvent
}