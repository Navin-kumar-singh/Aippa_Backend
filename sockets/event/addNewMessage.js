const { DBMODELS } = require("../../database/models/init-models");

module.exports = (socket, io, user) => {

//  add new chat
    socket.on('addChat', async(chatData)=>{
       
        try {
            const chat = await DBMODELS.discussion_chat.create(chatData)
            const temp = chat.toJSON()
            const chatDatas = {
                id: temp?.id,
                userId:temp?.user_id,
                role:temp?.role,
                message: temp?.content,
                name:user?.name,
                profile:user?.profile,
                isPoint:temp?.type==='point'?true:false,
                time:temp.createdAt,
            }
            io.emit('newChatAdded', chatDatas)
            io.emit('moveChatToBottom')
            console.log('chat', chatDatas)
        } catch (error) {
            console.log(error.message)
        }
    })

// add new reply
    socket.on('postChatReply', async(data)=>{

        try {
            const reply = await DBMODELS.discussion_reply.create(data)

            if(reply){
                
                console.log('reply', reply?.dataValues)
                // change the data format for frontend 
                const datas = {
                    id:reply?.dataValues?.id,
                    msgId:reply?.dataValues.chat_id,
                    name:user?.name,
                    profile:user?.profile,
                    time:reply?.dataValues?.createdAt,
                    message:reply?.dataValues?.content
                }
                io.emit('getChatReply', datas)
                console.log(datas)
            }
            else{
                console.log('something went wrong with the reply chat')
            }
        } catch (error) {
            console.log('error', error.message)
        }
    })

  };