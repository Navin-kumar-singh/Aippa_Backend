const { DBMODELS } = require("../../database/models/init-models");
const { s3deleteObject } = require("../../aws/s3ObjectFunctions");
const { mysqlcon } = require("../../model/db");

// controller for compliances 
const getCompliance = async (req, res) => {
  try {
    const compliance = await DBMODELS.compliance.findAll()
    res.status(200).json({
      message: 'successfully get',
      result: compliance,
    })
  } catch (error) {
    res.json(500).json({ message: error.message });
  }
}
const getComplianceById = async (req, res) => {
  const complianceId = req.params.id;
  try {
    const compliance = await DBMODELS.compliance.findByPk(complianceId);
    if (!compliance) {
      return res.status(404).json({ message: 'Compliance not found' });
    }
    res.status(200).json({ message: 'Successfully retrieved', result: compliance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createCompliance = async (req, res) => {
  const body = req.body;
  try {
    const compliance = await DBMODELS.compliance.create(body);
    res.status(200).json({ message: "succesfully created", result: compliance });
  } catch (error) {
    res.status(500).json({ message: error.json })
  }
}
const deleteCompliance = async (req, res) => {
  const complianceId = req.params.id; // Assuming you pass the compliance ID as a URL parameter
  try {
    const compliance = await DBMODELS.compliance.findByPk(complianceId);
    if (!compliance) {
      return res.status(404).json({ message: 'Compliance not found' });
    }
    await compliance.destroy();
    res.status(200).json({ message: 'Successfully deleted', result: compliance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCompliance = async (req, res) => {
  const complianceId = req.params.id;
  const updatedData = req.body;

  try {
    const compliance = await DBMODELS.compliance.findByPk(complianceId);

    if (!compliance) {
      return res.status(404).json({ message: 'Compliance not found' });
    }

    await compliance.update(updatedData);

    res.status(200).json({ message: 'Successfully updated', result: compliance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller for questions

const createQuestion = async (req, res) => {
  const body = req.body;
  try {
    const question = await DBMODELS.compliance_questions.create(body);
    res.status(200).json({ message: 'successfully created ', result: question })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteQuestion = async (req, res) => {
  const questionId = req.params.id;

  try {
    const deletedQuestion = await DBMODELS.compliance_questions.destroy({
      where: { id: questionId },
    });

    if (deletedQuestion === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ message: 'Successfully deleted', result: deletedQuestion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateQuestion = async (req, res) => {
  const questionId = req.params.id;
  const updatedData = req.body;

  try {
    const question = await DBMODELS.compliance_questions.findByPk(questionId);


    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const updated = await question.update(updatedData);


    res.status(200).json({ message: 'Successfully updated', result: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuestionById = async (req, res) => {
  const questionId = req.params.id;

  try {
    const question = await DBMODELS.compliance_questions.findByPk(questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ message: 'Successfully retrieved', result: question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllQuestion = async (req, res) => {
  try {
    const questions = await DBMODELS.compliance_questions.findAll();
    res.status(200).json({ message: 'fetching all question', result: questions })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const getAllQuestionByCategory = async (req, res) => {
  const { categoryId } = req.params
  try {
    const questions = await DBMODELS.compliance_questions.findAll({
      where: { categoryId: categoryId },
    });
    res.status(200).json({ message: 'fetching all question', result: questions })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const getAllQuestionByCompliance = async (req, res) => {
  const { complianceId } = req.params
  try {
    const questions = await DBMODELS.compliance_questions.findAll({
      where: { complianceId: complianceId },
    });
    res.status(200).json({ message: 'fetching all question', result: questions })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// compliance answer
const createAnswer = async (req, res) => {
  const body = req.body;
  try {
    const answer = await DBMODELS.compliance_answer.create(body)
    res.status(200).json({ message: "successfully created", result: answer })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getAnswer = async (req, res) => {
  const body = req.body;
  try {
    const answer = await DBMODELS.compliance_answer.findAll()
    res.status(200).json({ message: "successfully get", result: answer })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const getAnswerById = async (req, res) => {
  const { id } = req.params;
  try {
    const answer = await DBMODELS.compliance_answer.findByPk(id);
    res.status(200).json({ message: 'fetched succesfully', result: answer })
  } catch (error) {

  }
}

const deleteAnswer = async (req, res) => {
  const { id } = req.params
  const body = req.body;
  try {
    const answer = await DBMODELS.compliance_answer.destroy({
      where: {
        id: id,
      }
    })
    res.status(200).json({ message: "successfully delete", result: answer })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateAnswer = async (req, res) => {
  const { id } = req.params;
  const updatedBody = req.body;
  try {
    const answer = await DBMODELS.compliance_answer.findByPk(id);
    if (!answer) {
      return res.status(404).json('Answer not found');
    }
    const updated = await answer.update(updatedBody);
    res.status(200).json({ message: 'successfully Updated', result: updated })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//compliance category
const createCategory = async (req, res) => {
  const body = req.body;
  try {
    const category = await DBMODELS.compliance_category.create(body);
    res.status(200).json({ messsage: 'created succesfully', result: category })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const rowsDeleted = await DBMODELS.compliance_category.destroy({
      where: { id: categoryId },
    });
    if (rowsDeleted === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const updates = req.body;
  try {
    const category = await DBMODELS.compliance_category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.update(updates);
    res.status(200).json({ message: 'Category updated successfully', result: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await DBMODELS.compliance_category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ result: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await DBMODELS.compliance_category.findAll();
    res.status(200).json({ result: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCategoriesByComplianceId = async (req, res) => {
  const { complianceId } = req.params;
  try {
    const categories = await DBMODELS.compliance_category.findAll({
      where: { complianceId: complianceId },
    });
    res.status(200).json({ result: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// compliance response

const createResponse = async (req, res) => {
  const body = req.body;
  try {
    const response = DBMODELS.compliance_response.create(body);
    res.status(200).json({ message: 'successfully created', result: response })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const deleteResponse = async (req, res) => {
  const responseId = req.params.id;
  try {
    const rowsDeleted = await DBMODELS.compliance_response.destroy({
      where: { id: responseId },
    });
    if (rowsDeleted === 0) {
      return res.status(404).json({ message: 'Response not found' });
    }
    res.status(200).json({ message: 'Response deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateResponse = async (req, res) => {
  const { id } = req.params;
  const updated = req.body;
  try {
    const response = await DBMODELS.compliance_response.findByPk(id);
    if (!response) {
      return res.status(400).json({ message: 'response not found' });
    }
    await response.update(updated);
    res.status(200).json({ message: 'Response update succesfully', result: response });
  } catch (error) {

  }
}

const getAllResponses = async (req, res) => {
  try {
    const responses = await DBMODELS.compliance_response.findAll();
    res.status(200).json({ result: responses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResponseByComplianceId = async (req, res) => {
  const complianceId = req.params.complianceId;
  try {
    const responses = await DBMODELS.compliance_response.findAll({
      where: { complianceId: complianceId },
    });
    res.status(200).json({ result: responses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getResponseByInstituteId = async (req, res) => {
  const instituteId = req.params.instituteId;
  try {
    const responses = await DBMODELS.compliance_response.findAll({
      where: { instituteId: instituteId },
    });
    res.status(200).json({ result: responses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResponseById = async (req, res) => {
  const responseId = req.params.id;
  try {
    const response = await DBMODELS.compliance_response.findByPk(responseId);
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }
    res.status(200).json({ result: response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createCompliance,
  deleteCompliance,
  updateCompliance,
  getCompliance,
  getComplianceById,
  // questions
  createQuestion,
  deleteQuestion,
  updateQuestion,
  getQuestionById,
  getAllQuestion,
  getAllQuestionByCategory,
  getAllQuestionByCompliance,

  // answers
  createAnswer,
  getAnswer,
  deleteAnswer,
  updateAnswer,
  getAnswerById,

  // category
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryById,
  getAllCategories,
  getAllCategoriesByComplianceId,

  // response
  createResponse,
  deleteResponse,
  updateResponse,
  getAllResponses,
  getResponseByComplianceId,
  getResponseByInstituteId,
  getResponseById,
}