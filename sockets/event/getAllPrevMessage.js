const sequelize = require("../../database/connection");
const { DBMODELS } = require("../../database/models/init-models");

module.exports = (socket, io, user) => {

    const getAllPrevChat = async(discussion_id)=>{
       
        try {
            const allchats = await DBMODELS.discussion_chat.findAll({
                where:{
                    discussion_id
                },
                raw:true,
                attributes:[
                    'id',
                     [sequelize.col('user_id'),'userId'],
                      'role',
                    [sequelize.col('content'),'message'] ,
                    [sequelize.literal(`(
                        COALESCE(
                            (
                                select concat(first_name,' ',last_name)
                                from students 
                                where students.id = discussion_chat.user_id
                            ),
                            (
                                select institution_name
                                from institutions 
                                where institutions.id = discussion_chat.user_id and discussion_chat.role='institute'
                            )
                        )
                    )`),'name'],
                    [sequelize.literal(`(
                        COALESCE(
                            (
                                select profile
                                from students 
                                where students.id = discussion_chat.user_id
                            ),
                            (
                                select logo
                                from institutions 
                                where institutions.id = discussion_chat.user_id and discussion_chat.role='institute'
                            )
                        )
                    )`),'profile'],
                    [sequelize.literal(`CASE WHEN discussion_chat.type = 'point' THEN true ELSE false END `),'isPoint'],
                    [sequelize.col(`createdAt`),'time'],
                    [sequelize.literal(`(
                        select count(*) 
                        from discussion_likes
                        where discussion_likes.chat_id  = discussion_chat.id
                    )`),'likes'],
                    [sequelize.literal(`(
                        select count(*) 
                        from discussion_dislikes
                        where discussion_dislikes.chat_id  = discussion_chat.id
                    )`),'dislikes']
                ]
            })
            
            io.emit('allPrevChat', allchats)
            // console.log('chats', allchats)
        } catch (error) {
            console.log(error.message)
        }
    }

  socket.on('getAllPrevChat', getAllPrevChat)
   
    // get all reply on load 

    socket.on('getAllReplyByDiscussionId', async(id)=>{
        console.log('inside this ')
        try {
            const allReply = await DBMODELS.discussion_reply.findAll({
                where :{
                    discussion_id:id
                }, raw:true,attributes:[
                    'id', 
                    [sequelize.col('chat_id'),'msgId'],
                    [sequelize.literal(`(
                        COALESCE(
                            (
                                select concat(first_name,' ' , last_name)
                                from students
                                 where students.id = discussion_reply.user_id 
                            ),
                            (
                                select institution_name
                                from institutions 
                                where institutions.id = discussion_reply.user_id 
                            )
                        )
                    )`),'name'],
                    [sequelize.literal(`(
                        COALESCE(
                            (
                                select profile
                                from students 
                                where 
                                students.id = discussion_reply.user_id 
                               
                            ),
                            (
                                select logo
                                from institutions where institutions.id = discussion_reply.user_id 
                            )
                        )
                    )`),'profile'],
                    [sequelize.col('createdAt'),'time'],
                    [sequelize.col('content'), 'message']

                ]
            })
            if(allReply){
                console.log('data ', allReply)
                io.emit('getChatReplyAll', allReply)
            }
            else{
                console.log('something went wrong')
            }
        } catch (error) {
            console.log('error', error.message)
        }
    })

    socket.on('getVotablePointCount', async(discussion_id)=>{
        try {
            const uservotableChat = await DBMODELS.discussion_chat.count({
                where:{
                    discussion_id,
                    user_id:user.id,
                    role:user.role,
                    type:'point'
                }
            })
            const remainingVotablePoint = 4-uservotableChat>=0?4-uservotableChat:0
            socket.emit('votablePointCount', remainingVotablePoint)
            // console.log('uservotablechat',remainingVotablePoint)
        } catch (error) {
            console.log(error.message)
        }
    })

    socket.on('hitChatLike', async (data)=>{
        try {
            const chatLike = await DBMODELS.discussion_likes.findOne({
                where:{
                    user_id:user?.id,
                    chat_id:data?.id,
                    role:user?.role,
                },raw:true
            })
            const chatdislike = await DBMODELS.discussion_dislikes.findOne({
                where:{
                    user_id:user?.id,
                    chat_id:data?.id,
                    role:user?.role,
                }
            })
            if(chatLike){
                // if chatlike exist then remove the chatLike
                await DBMODELS.discussion_likes.destroy({
                    where :{
                        user_id:user?.id,
                        chat_id:data?.id,
                        role:user?.role,
                    },raw:true
                })
                // console.log('deleted succesfully')
            }
            else{
                // if chatdislike present then destroy it 
                await DBMODELS.discussion_dislikes.destroy({
                    where:{
                        user_id:user?.id,
                        chat_id:data?.id,
                        role:user?.role,
                    }
                })

                // if chatlike not exist then add the chat like
              const newLike =   await DBMODELS.discussion_likes.create({
                    user_id:user?.id,
                    chat_id:data?.id,
                    role:user?.role,
                    institute_id:user?.instituteId,
                    discussion_id:data?.discussionId
                },)
                // console.log('newLike', newLike.dataValues )
            }
            getAllPrevChat(data?.discussionId)

        } catch (error) {
            console.log(error.message)
        }
    })

    socket.on('hitChatdisLike', async (data)=>{
        try {
            const chatdisLike = await DBMODELS.discussion_dislikes.findOne({
                where:{
                    user_id:user?.id,
                    chat_id:data?.id,
                    role:user?.role,
                },raw:true
            })
            const chatLike = await DBMODELS.discussion_likes.findOne({
                where:{
                    user_id:user?.id,
                    chat_id:data?.id,
                    role:user?.role,
                },raw:true
            })
            if(chatdisLike){
                // if chatdislike exist then remove the chatdisLike
                await DBMODELS.discussion_dislikes.destroy({
                    where :{
                        user_id:user?.id,
                        chat_id:data?.id,
                        role:user?.role,
                    },raw:true
                })
                // console.log('deleted succesfully')
            }
            else{
                // if already like present then destroy like and add dislike
                if(chatLike){
                    await DBMODELS.discussion_likes.destroy({
                        where :{
                            user_id:user?.id,
                            chat_id:data?.id,
                            role:user?.role,
                        }
                    })
                }
                // if chatdislike not exist then add the chat dislike
              const newdisLike =   await DBMODELS.discussion_dislikes.create({
                    user_id:user?.id,
                    chat_id:data?.id,
                    role:user?.role,
                    institute_id:user?.instituteId,
                    discussion_id:data?.discussionId
                },)
                // console.log('newdisLike', newdisLike.dataValues )
            }

            getAllPrevChat(data?.discussionId)

        } catch (error) {
            console.log(error.message)
        }
    })

    socket.on('getCurrentChatData', async (data)=>{
        try {
            const chatDetail = await DBMODELS.discussion_chat.findOne({
                where:{
                    id:data?.id
                },
                raw:true
            })
            // console.log('chatDetail', chatDetail)
            socket.emit('currentChatData', chatDetail)
        } catch (error) {
            console.log(error.message)
        }
    })

    
  };