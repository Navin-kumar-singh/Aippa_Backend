const express = require("express");
const { postAddCategory, updateCategory, getCategory, deleteCategory, getCategoryById, addQuestion, updateQuestion, getQuestion, deleteQuestion, getQuestionById, addAnswer, updateAnswer, getAnswer, deleteAnswer, getAnswerById, udpateCategoryOrder } = require("./carbon_footprint_cal.controller");
const cfcRouter = express.Router();

// category
cfcRouter.post("/cfcAddCategory", postAddCategory);
cfcRouter.put("/cfcCategory/:id", updateCategory);
cfcRouter.get("/cfcCategory", getCategory);
cfcRouter.delete("/cfcDeleteCategory/:id", deleteCategory);
cfcRouter.get("/cfcgetCategory/:id", getCategoryById);
cfcRouter.put("/cfcUpdateCategoryOrder/:id/direction/:direction", udpateCategoryOrder);

// question
cfcRouter.post("/cfcAddQuestion", addQuestion);
cfcRouter.put("/cfcUpdateQuestion/:id", updateQuestion);
cfcRouter.get("/cfcGetQuestion", getQuestion);
cfcRouter.delete("/cfcDeleteQuestion/:id", deleteQuestion);
cfcRouter.get("/cfcGetQuestion/:id", getQuestionById);

// answer
cfcRouter.post("/cfcAddAnswer", addAnswer);
cfcRouter.put("/cfcUpdateAnswer/:id", updateAnswer);
cfcRouter.get("/cfcGetAnswer", getAnswer);
cfcRouter.delete("/cfcDeleteAnswer/:id", deleteAnswer);
cfcRouter.get("/cfcGetAnswerById/:id", getAnswerById);


module.exports =  cfcRouter ;
