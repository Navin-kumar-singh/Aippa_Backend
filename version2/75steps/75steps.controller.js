
const { mysqlcon } = require("../../model/db");
const { DBMODELS } = require("../../database/models/init-models");
const sequelize = require("../../database/connection");
const { Op } = require("sequelize");






const getAllCategory = async(req,res)=>{
    
    try {
        const allTask = await DBMODELS.steps_75_category.findAll()

        return res.json({
            message:'Successfully get all category',
            result:allTask
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}
const addCategory = async(req,res)=>{
    const body = req.body
    try {
        const task = await DBMODELS.steps_75_category.create(body)

        return res.json({
            message:'Successfully add category',
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}

const updateCategory = async(req,res)=>{
    const {id} = req.params
    const body = req.body;
    try {
        const allTask = await DBMODELS.steps_75_category.update(body,{where:{id:id}})

        return res.json({
            message:'Successfully update task',
            result:allTask
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}


const getCategoryById = async(req,res)=>{
    const {id} = req.params
    try {
        const task = await DBMODELS.steps_75_category.findOne({where:{id:id}})

        return res.json({
            message:'Successfully get task',
            result:task
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}
const deleteCategory  = async(req,res)=>{
    const {id} = req.params
    try {
        const task = await DBMODELS.steps_75_category.destroy({where:{id:id}})

        return res.json({
            message:'Successfully delete task',
            result:task
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}


const getAllTask = async(req,res)=>{
    
    try {
        const allTask = await DBMODELS.steps_75_task.findAll()

        return res.json({
            message:'Successfully get all task',
            result:allTask
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}
const addTask = async(req,res)=>{
    const body = req.body
    try {
        const task = await DBMODELS.steps_75_task.create(body)

        return res.json({
            message:'Successfully add task',
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}

const updateTask = async(req,res)=>{
    const {taskId} = req.params
    const body = req.body;
    try {
        const allTask = await DBMODELS.steps_75_task.update(body,{where:{id:taskId}})

        return res.json({
            message:'Successfully update task',
            result:allTask
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}


const getTaskById = async(req,res)=>{
    const {taskId} = req.params
    try {
        const task = await DBMODELS.steps_75_task.findOne({where:{id:taskId}})

        return res.json({
            message:'Successfully get task',
            result:task
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}
const deleteTask  = async(req,res)=>{
    const {taskId} = req.params
    try {
        const task = await DBMODELS.steps_75_task.destroy({where:{id:taskId}})

        return res.json({
            message:'Successfully delete task',
            result:task
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}


const addAttempts = async(req,res)=>{
    const body = req.body
    console.log('body', body)
    try {
        const attempts= await DBMODELS.steps_75_attempt.create(body)
        return res.json({
            message:'succcessfully add attempts',
            result:attempts
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}
const getAllAttempts = async(req,res)=>{

    try {
        const allAttempts= await DBMODELS.steps_75_attempt.findAll()
        return res.json({
            message:'succcessfully get all',
            result:allAttempts
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}

const getAllAttemptsByUserId = async(req,res)=>{
    const {userId} = req.params
    try {
        const allAttempts= await DBMODELS.steps_75_attempt.findAll({
            where:{
                userId
            }
        })
        return res.json({
            message:'succcessfully get all',
            result:allAttempts
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}

const getAttempById = async(req,res)=>{
    const {id}=req.params
    try {
        const attempts= await DBMODELS.steps_75_attempt.findOne({
            where:{id}
        })
        return res.json({
            message:'succcessfully get all',
            result:attempts
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}

const updateAttempt = async(req,res)=>{
    const body = req.body
    const {id}= req.params
    try {
        const attempts= await DBMODELS.steps_75_attempt.update(body, {where:{id}})
        return res.json({
            message:'succcessfully get all',
            result:attempts
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}

const deleteAttempt = async(req,res)=>{
    const {id}= req.params
    try {
        const attempts= await DBMODELS.steps_75_attempt.destroy({
            where:{id}
        })
        return res.json({
            message:'succcessfully get all',
            result:attempts
        })
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}

const calculateDayCount = (startDate) => {
    const currentDate = new Date(); // calculating the user date the date of attempt
    const timeDifference = currentDate - new Date(startDate);
    const dayCount = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    console.log('daycount', dayCount)
    return dayCount;// return the same time and the point of intersection
  };

  const todaysChallenge= async(req,res)=>{
    const {attemptId} = req.params// this is user attempt
    try {
        const userAttempt= await DBMODELS.steps_75_attempt.findOne({
            where :{
                id:attemptId
            }
        })
        
        if(userAttempt){
            const userDayCount= calculateDayCount(userAttempt.start_date)
            const todaysChallenge = await DBMODELS.steps_75_task.findOne({
                where :{
                    day_count:userDayCount
                },attributes:[
                    'id', 'day_count', 'credit', 'description', 'order', 
                    [sequelize.literal(`(
                        select p.status 
                        from steps_75_task_performance as p
                        where p.taskId = steps_75_task.id and p.attemptId = ${attemptId}
                    )`),'status'],
                    [sequelize.literal(`(
                        select a.start_date 
                        from steps_75_attempt as a
                        where a.id = ${attemptId}
                    )`),'start_date'],
                    [sequelize.literal(`(
                        select tp.images 
                        from steps_75_task_performance as tp
                        where tp.taskId = steps_75_task.id and tp.attemptId = ${attemptId}
                    )`),'images'],
                    [sequelize.literal(`(
                        select tp.experience 
                        from steps_75_task_performance as tp
                        where tp.taskId = steps_75_task.id and tp.attemptId = ${attemptId}
                    )`),'experience']
                ]
            })
            return res.json({
                message:'success', 
                result:todaysChallenge,
            })
        }
    } catch (error) {
        return res.json({message:error.message})
    }
}

const pastChallenge= async(req,res)=>{
    const {attemptId} = req.params// this is user attempt
    try {
        const userAttempt= await DBMODELS.steps_75_attempt.findOne({
            where :{
                id:attemptId
            }
        })
        
        if(userAttempt){
            const userDayCount= calculateDayCount(userAttempt.start_date) 
            const todaysChallenge = await DBMODELS.steps_75_task.findAll({
                where :{
                    day_count:{
                        [Op.lt]: userDayCount
                    },
                },
                attributes:[
                    'id','day_count',
                    [sequelize.col('credit'),'total_credit'],
                    'description','order',
                    [sequelize.literal(`(
                        SeLECT tp.credit_earned
                        FROM steps_75_task_performance as tp 
                        where tp.attemptId = ${attemptId} and  tp.taskId = steps_75_task.id
                        ORDER BY tp.createdAt DESC
                        LIMIT 1
                    )`),'credit_earned'],
                    [sequelize.literal(`(
                        SeLECT tp.status
                        FROM steps_75_task_performance as tp
                        where tp.attemptId = ${attemptId} and  tp.taskId = steps_75_task.id
                        ORDER BY tp.createdAt DESC
                        LIMIT 1
                        )`),'status']
                ]
            })
            return res.json({
                message:'success', 
                result:todaysChallenge,
            })
        }
        return res.json({
            message:'no attempt found'
        })
    } catch (error) {
        return res.json({message:error.message})
    }
}

const checkUserAttempt = async (req, res) => {
    const { userId, role } = req.params;
  
    try {
      const result = await DBMODELS.steps_75_attempt.findOne({
        where: {
          userId,
          role,
        },
        attributes: ['id','points_earned', 'start_date'],
        order:[['createdAt', 'DESC']],
      });
  
      if (!result) {
        return res.json({ message:'no attempt', result:null});
      }
  
      const startDate = new Date(result.start_date);
      const currentDate = new Date();
  
      // Calculate the difference in days
      const timeDifference = currentDate.getTime() - startDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      console.log('daysdiff', timeDifference,' ',daysDifference)
      // Check if 21 days have passed
      const status = daysDifference >= 21 ? 'complete' : 'pending';

      const attempt = {
        id:result.id,
        status:status,
        points_earned: result.points_earned,
      }
      return res.json({ result:attempt });
    } catch (error) {
      return res.json({ error: error.message });
    }
  };


  const pastChallengeDetail = async (req, res) => {
    const {taskId, attemptId} = req.params;

    try {
        const result = await DBMODELS.steps_75_task_performance.findOne({
            where:{
                taskId,
                attemptId,
            },
            attributes:[
                'id','status', 'experience','images',
                'credit_earned',
                [sequelize.literal(`(
                    select day_count
                    from steps_75_task
                    where steps_75_task.id = steps_75_task_performance.taskId
                )`),'day_count']
            ]
        })
        if(result){
            return res.json({
                message:'get data',
                result
            })
        }else{
            const result  = await DBMODELS.steps_75_task.findOne({
                where:{
                    id:taskId
                }
            })
            return res.json({
                message:'no data',
                result
            })
        }
    } catch (error) {
        return res.json({
            message:error.message,
        })
    }
};


const submitChallenge = async (req,res)=>{
    const body = req.body
    try {
        // attempt detail
        if(body?.attemptId){
            const attemptDetail = await DBMODELS.steps_75_attempt.findOne({
                where:{id:body?.attemptId}
            })
            
            // if valid attempt
           if(attemptDetail){
                const taskPerformance = await DBMODELS.steps_75_task_performance.findOne({
                    where:{
                        attemptId:body?.attemptId,
                        taskId:body?.taskId
                    }
                })
                console.log('taskPer', taskPerformance)
                if(taskPerformance){
                    return res.json({
                        message:'Already Submit',
                        result:{}
                    })
                }
                const result = await DBMODELS.steps_75_task_performance.create(body);
                // update carbon credit
                const carbonCreditDetail=  await DBMODELS.carbonCredit.findOne({
                    where:{
                        userId:body?.userId,
                        role:body?.role
                    }
                })
                if(carbonCreditDetail){
                    //update carbon credit
                const udpatePoints = carbonCreditDetail?.score + body?.credit_earned;

                    await DBMODELS.carbonCredit.update(
                        {score:udpatePoints},
                        {
                            where:{
                                userId:body?.userId,
                                role:body?.role
                            }
                        }
                    )
                }else{
                    // create carbon credit and add credit
                    const data = {
                        userId:body?.userId,
                        role:body?.role,
                        score:body?.credit_earned
                    }
                    await DBMODELS.carbonCredit.create(data)
                }
                // update score
                const udpatePoints = attemptDetail?.points_earned + body?.credit_earned;
                await DBMODELS.steps_75_attempt.update(
                    {points_earned:udpatePoints},
                    {
                        where:{
                            id:body.attemptId
                        }
                    }
                )
                // fetch userDetail for post
                console.log('body.userId',body?.userId)
                const userDetail = body?.role==='institute'? await DBMODELS.institutions.findOne({
                                                              where:{
                                                                  id:body.userId,
                                                              }
                                                            })
                                                            :
                                                            await DBMODELS.students.findOne({
                                                              where:{
                                                                  id:body.userId,
                                                              }
                                                            })
            // creating post if user exist
               if(userDetail){
                const postBody = {
                    type:'profile',
                    userType:userDetail?.role,
                    postBy:`${userDetail?.first_name} ${userDetail?.last_name}`,
                    content:`Hi Guys Today I have Successfully Complete a Challenge in 75 Steps Challenge`,
                    instituteId:userDetail?.role==='institute'?userDetail?.id :userDetail?.instituteId ,
                    userId:userDetail?.id,
                    image:body?.images,
                    logo:userDetail?.profile || userDetail?.logo
                }
                console.log(postBody)
                await DBMODELS.posts.create(postBody)
               }
                return res.json({
                    message:'succesfully submit challenge',
                    result
                })
           }else{
            return res.json({
                message:'no attempt found',
                result
            })
           }
        }
        return res.json({
            message:'no attempt found',
            result:''
        })
    } catch (error) {
        return res.json({
            message:'Internal server error',
            error:error.message
        })
    }
}

const showCredit = async(req,res)=>{
    const {attemptId} = req.params;
    try {
        const score = await DBMODELS.steps_75_attempt.findOne({
            where:{
                id:attemptId
            },attributes:['points_earned']
        })

        if(score){
            return res.json({
                message:'get score',
                result:score?.points_earned || 0
            })
        }else{
            return res.json({
                message:'no attempt found',
                result:0
            })
        }

    } catch (error) {
         return res.json({
            message:error.message,
        })
    }
}

const showTaskDetailById  = async(req,res)=>{
    const {taskId, attemptId} = req.params;

    try {
        const result = await DBMODELS.steps_75_task_performance.findOne({
            where:{
                taskId,
                attemptId,
            },
            attributes:[
                'id','status', 'experience','images',
                'credit_earned',
                [sequelize.literal(`(
                    select day_count
                    from steps_75_task
                    where steps_75_task.id = steps_75_task_performance.taskId
                )`),'day_count']
            ]
        })
        if(result){
            return res.json({
                message:'get data',
                result
            })
        }else{
            const result  = await DBMODELS.steps_75_task.findOne({
                where:{
                    id:taskId
                }
            })
            return res.json({
                message:'no data',
                result
            })
        }
    } catch (error) {
        return res.json({
            message:error.message,
        })
    }
}

module.exports = { 
    showTaskDetailById,
    submitChallenge,
    getAllTask,
    addTask,
    updateTask,
    getTaskById,
    deleteTask,
    addAttempts,
    getAllAttempts,
    getAllAttemptsByUserId,
    getAttempById,
    updateAttempt,
    deleteAttempt,
    todaysChallenge,
    pastChallenge,
    checkUserAttempt,
    pastChallengeDetail,
    getAllCategory,
    addCategory,
    updateCategory,
    getCategoryById,
    deleteCategory,
    showCredit,

};
