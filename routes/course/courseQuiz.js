/*
  ======== Student Quiz Control ============
  - fetch Quiz  
  - fetch Quiz result for a Course Quiz

 */
const sequelize = require("../../database/connection");
const { DBMODELS } = require("../../database/models/init-models");
const { mysqlcon } = require("../../model/db");
const logg = require("../../utils/utils");

async function quizResult(req, res) {
  const {studentId} = req.params;
  const {
    quizId,
    totalQuestions,
    totalAttemted,
    totalCorrected,
    progress,
    studentResult,
    date,
  } = req.body;

  try {
    if (
      quizId &&
      studentId &&
      totalQuestions &&
      totalAttemted &&
      progress &&
      date
    ) {
      const existingQuiz = await sequelize.query(
        'SELECT * FROM student_quiz WHERE studentId=:studentId AND quizId=:quizId',
        {
          replacements: { studentId, quizId },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (existingQuiz.length > 0) {
        if (existingQuiz[0].result === 'PASS') {
          return res.status(201).json({
            message: 'Student Already Cleared Passing Criteria!!!',
            Data: existingQuiz[0],
          });
        } else {
          await sequelize.query(
            `UPDATE student_quiz SET total_question=:totalQuestions, total_attemted=:totalAttemted, total_correct=:totalCorrected, result=:studentResult, createdAt=:date, progress=:progress WHERE id=:id;`,
            {
              replacements: {
                totalQuestions,
                totalAttemted,
                totalCorrected,
                studentResult,
                date,
                progress,
                id: existingQuiz[0].id,
              },
            }
          );

          return res.status(200).json({ message: 'Updated Successfully' });
        }
      } else {
        await sequelize.query(
          `INSERT INTO student_quiz(studentId, quizId, total_question, total_attemted, total_correct, result, createdAt, progress) 
          VALUES (:studentId, :quizId, :totalQuestions, :totalAttemted, :totalCorrected, :studentResult, :date, :progress);`,
          {
            replacements: {
              studentId,
              quizId,
              totalQuestions,
              totalAttemted,
              totalCorrected,
              studentResult,
              date,
              progress,
            },
          }
        );

        return res.status(200).json({ message: 'Updated Successfully' });
      }
    } else {
      return res.status(404).json({
        message: 'Data is Missing',
        Data: req.body,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


function fetchQuiz(req, res) {
  const {studentId} = req.params;
  const { quizId } = req.body;
  if ((studentId, quizId)) {
    // query
    mysqlcon.query(
      `SELECT * FROM student_quiz WHERE studentId=${studentId} AND quizId=${quizId}`,
      (err, result) => {
        // IF ERROR
        if (err) {
          logg.error(err);
          res.status(500).json({ message: "Internal Server Error" });
        } else {
          // NO ERROR
          var studentResult = result[0]; //for passing the value in else condition
          //IF PASS
          if (result[0] && result[0].result === "PASS") {
            res.status(201).json({
              message: "Student Already Clear Passing Criteria!!!",
              result: result[0],
            });
            // IF NOT PASS
          } else {
            mysqlcon.query(
              `SELECT * FROM quiz WHERE id=${quizId}`,
              function (err, result) {
                if (err) {
                  logg.error(err);
                  res.status(500).json({ message: "Internal Server Error" });
                } else if (result.length) {
                  let quiz = result[0];
                  mysqlcon.query(
                    `SELECT * FROM questions WHERE quizId=${quiz.id}`,
                    function (err, result) {
                      if (err) {
                        logg.error(err);
                        res
                          .status(500)
                          .json({ message: "Internal Server Error" });
                      } else {
                        res.status(200).json({
                          message: "Fetched Succesfully",
                          result: studentResult,
                          data: { ...quiz, question: result },
                        });
                      }
                    }
                  );
                } else {
                  res.status(404).json({ message: "Quiz not Found" });
                }
              }
            );
          }
        }
      }
    );
  } else {
    res.status(404).json({ message: "Data is Missing!!!" });
  }
}

function fetchAllQuiz(res, res) {
  DBMODELS.quiz
    .findAll()
    .then((result) => {
      res.json({ status: 200, result });
    })
    .catch((err) => {
      res.json({ status: 404, message: err?.message });
    });
}

function createQuiz(req, res) {
  const body = req.body;
  if (body?.title && body.duration && body?.level) {
    DBMODELS.quiz
      .create(body)
      .then((result) => {
        res.json({ status: 200, message: "Created Succesfully" });
      })
      .catch((err) => {
        res.json({ status: 500, message: err?.message });
      });
  } else {
    res.json({ status: 404, message: "Data Not Found!" });
  }
}
function fetchQuetions(req, res) {
  const { id } = req.query;
  DBMODELS.questions
    .findAll({ where: { quizId: id } })
    .then((result) => {
      res.json({ status: 200, result });
    })
    .catch((err) => {
      res.json({ status: 404, message: err?.message });
    });
}
function createQuestion(req, res) {
  const body = req.body;
  DBMODELS.questions
    .create(body)
    .then((result) => {
      res.json({ status: 200, message: "Question Created!" });
    })
    .catch((err) => {
      res.json({ status: 500, message: err.message });
    });
}

module.exports = {
  fetchQuiz,
  quizResult,
  createQuiz,
  fetchAllQuiz,
  fetchQuetions,
  createQuestion,
};
