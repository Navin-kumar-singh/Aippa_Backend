const { DBMODELS } = require("../../database/models/init-models");
const sequelize = require("../../database/connection");
const { Op } = require("sequelize");

const postAddCategory = async (req,res)=>{
    const body  = req.body
    try {
        const order = await DBMODELS.cfc_category.count()+1
        const category = await DBMODELS.cfc_category.create({...body,order})
        return res.json({
            message:'succesfully created', 
            category
        })
    } catch (error) {
        return res.json({error:error.message})
    }
}

const updateCategory = async (req,res)=>{
    const body = req.body
    const {id} = req.params
    try {
        const category = await DBMODELS.cfc_category.update(
            body,
           { 
                where:{
                    id
                }
            }
        )
        return res.json({
            message:'succesfully updated', 
            category
        })
    } catch (error) {
        return res.json({error:error.message})
    }
}

const getCategory = async (req,res)=>{

    try {
        const categories  = await DBMODELS.cfc_category.findAll({
            order: [['order', 'ASC'],['updatedAt', 'DESC']],
        })
        return res.json({
            message:'SuccessFully Fetched', 
            categories,
        })
    } catch (error) {
        return res.json({error:error.message})
    }
}

const deleteCategory = async (req,res)=>{
        const {id} = req.params
    try {
        const category = await DBMODELS.cfc_category.findOne({
            where:{
                id
            }
        })
       console.log('category.order', category.order)
       if(category.order){
        await DBMODELS.cfc_category.update(
            { order: sequelize.literal('`order` - 1') },
            { where: { order: { [Op.gt]: category.order } } }
          );
       }
       await DBMODELS.cfc_category.destroy({
        where:{
            id
        }
    })
        return res.json({
            message:'Deleted Succesfully', 
        })
    } catch (error) {
        return res.json({error:error.message})
    }
}

const getCategoryById = async (req,res)=>{
    const {id} = req.params
    try {
        const category = await DBMODELS.cfc_category.findOne({
            where :{
                id
            }
        })
        return res.json({
            message:'success', 
            category
        })
    } catch (error) {
        return res.json({error:error.message})
    }
}

const udpateCategoryOrder = async(req,res)=>{
    const {id, direction} = req.params;
    // first 1
    // second 2
    // third 3

    // 6th 6
    try {
        
        const category = await DBMODELS.cfc_category.findOne({
            where:{
                id
            }
        })
        if(category){
            const existingOrder = category?.order
            const newOrder= direction==='up'?(existingOrder-1)===0?1:existingOrder-1:existingOrder+1
            console.log('existingorder', existingOrder)
            console.log('newOrder', newOrder)
            // swapping the category
            // check if category is top most
           if((existingOrder===1 && direction==='down') || existingOrder!==1){
            const swap = await DBMODELS.cfc_category.update({order:existingOrder},
                {where:{order:newOrder}})
                    
                if(swap[0]){
                    await DBMODELS.cfc_category.update({order:newOrder},
                        {where :{id}
                    })
                }
                console.log('swap',swap[0])
           }
            return res.json({
                message:'success'
            })
        }
        else{
            return res.json({
                message:'no category'
            })
        }
        
        
    } catch (error) {
        return res.json(error.message)
    }
}



const addQuestion = async (req,res)=>{
    const body = req.body
    try {
        const question = await DBMODELS.cfc_questions.create(body)
        return res.json({
            message:'Add Question',
            question,
        })
    } catch (error) {
        return res.json({error:error.message})
    }
}

const updateQuestion = async (req,res)=>{

    const body = req.body
    const {id} = req.params
    try {
        const question = await DBMODELS.cfc_questions.update(
            body,
           { 
                where:{
                    id
                }
            }
        )
        return res.json({
            message:'succesfully updated', 
            question
        })
    } catch (error) {
        return res.json({error:error.message})
    }
}
const getQuestion = async (req,res)=>{

    try {
        const questions  = await DBMODELS.cfc_questions.findAll({
            order:[['order', 'ASC']]
        })
        return res.json({
            message:'SuccessFully Fetched', 
            questions,
        })
        
    } catch (error) {
        return res.json({error:error.message})
    }
}
const deleteQuestion = async (req,res)=>{

    try {
        
    } catch (error) {
        return res.json({error:error.message})
    }
}
const getQuestionById = async (req,res)=>{

    try {
        
    } catch (error) {
        return res.json({error:error.message})
    }
}
const addAnswer = async (req,res)=>{

    try {
        
    } catch (error) {
        return res.json({error:error.message})
    }
}
const updateAnswer = async (req,res)=>{

    try {
        
    } catch (error) {
        return res.json({error:error.message})
    }
}
const getAnswer = async (req,res)=>{

    try {
        
    } catch (error) {
        return res.json({error:error.message})
    }
}
const deleteAnswer = async (req,res)=>{

    try {
        
    } catch (error) {
        return res.json({error:error.message})
    }
}
const getAnswerById = async (req,res)=>{

    try {
        
    } catch (error) {
        return res.json({error:error.message})
    }
}



module.exports = {
    postAddCategory,
    updateCategory,
    getCategory,
    deleteCategory,
    getCategoryById,
    addQuestion,
    updateQuestion,
    getQuestion,
    deleteQuestion,
    getQuestionById,
    addAnswer,
    updateAnswer,
    getAnswer,
    deleteAnswer,
    getAnswerById,
    udpateCategoryOrder,
};
