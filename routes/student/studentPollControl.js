/*
 ====== Stundet Poll Control ===== 
 - Add / Update / fetch poll date
 - Fetch Poll Vote Count 
 */
const { DBMODELS } = require("../../database/models/init-models");
const { mysqlcon } = require("../../model/db");
const logg = require("../../utils/utils");

function getPollData(req, res) {
  const studentId = req.user.id;
  console.log('req.user', req.user)
  if (studentId) {
    mysqlcon.query(
      `SELECT pq.*,sp.vote FROM poll_questions AS pq
        LEFT JOIN student_poll as sp
        ON sp.studentId=${studentId} AND poll_question_id=pq.id
        WHERE pq.status='ACTIVE';`,
      (err, result) => {
        if (err) {
          logg.error(err);
          res.status(500).json({ message: "Internal Sever Error!!!!" });
        } else {
          res
            .status(200)
            .json({ message: "Poll fetched Successfully", result });
        }
      }
    );
  } else {
    res.status(404).json({ message: "Data is Missing!!!" });
  }
}
function setPollData(req, res) {
  const studentId = req.user.id;
  const { vote, pollQuestionId } = req.body;
  if (vote && studentId && pollQuestionId) {
    mysqlcon.query(
      `SELECT id FROM student_poll WHERE studentId='${studentId}' AND poll_question_id='${pollQuestionId}' `,
      (err, result) => {
        if (err) {
          logg.error(err);
          res.status(500).json({ message: "Internal Sever Error!!!!" });
        } else {
          if (result.length) {
            res.status(201).json({ message: "Vote is Already Submited! " });
          } else {
            mysqlcon.query(
              `INSERT INTO student_poll (studentId,poll_question_id,vote) VALUES ('${studentId}','${pollQuestionId}','${vote}' )`,
              (err, result) => {
                if (err) {
                  logg.error(err);
                  res.status(500).json({ message: "Internal Sever Error!!!!" });
                }
                if (result) {
                  res.status(200).json({ message: "Vote Is Submited!" });
                }
              }
            );
          }
        }
      }
    );
  } else {
  }
}
function getVoteCount(req, res) {
  mysqlcon.query(
    `SELECT poll_question_id,vote,COUNT(vote)/(SELECT COUNT(vote) FROM student_poll WHERE poll_question_id=sp.poll_question_id )*100 AS votePercent
        FROM student_poll AS sp  GROUP BY vote;`,
    (err, result) => {
      if (err) {
        logg.error(err);
        res.status(500).json({ message: "Internal Sever Error!!!!" });
      } else {
        res.status(200).json({ result });
      }
    }
  );
}
// =========================Version 2 API========================
function fetchpollData(req, res) {
  try {
    DBMODELS.poll_questions.findAll().then((result) => {
      res.status(200).json({ message: "Poll fetched Successfully", result });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Sever Error!!!!" });
  }
}
function EditPollData(req, res) {
  const { todo } = req.query;
  const { id } = req.body;
  if (todo === "DELETE") {
    DBMODELS.poll_questions
      .destroy({
        where: {
          id,
        },
      })
      .then((result) => {
        res.status(200).json({ message: "Deleted Successfully." });
      })
      .catch((err) => {
        res.status(200).json({ message: "DATA NOT FOUND!" });
      });
  } else if (todo === "STATUS_ACTIVE") {
    DBMODELS.poll_questions
      .update(
        {
          status: "ACTIVE",
        },
        {
          where: { id },
        }
      )
      .then((result) => {
        res.status(200).json({ message: "Poll is Active Now." });
      })
      .catch((err) => {
        res.status(200).json({ message: "DATA NOT FOUND!" });
      });
  } else if (todo === "STATUS_INACTIVE") {
    DBMODELS.poll_questions
      .update(
        {
          status: "INACTIVE",
        },
        {
          where: { id },
        }
      )
      .then((result) => {
        res.status(200).json({ message: "Poll is Inactive Now." });
      })
      .catch((err) => {
        res.status(200).json({ message: "DATA NOT FOUND!" });
      });
  } else if (todo === "UPDATE") {
    const { values } = req.body;
    DBMODELS.poll_questions
      .update(
        {
          poll_ques: values.ques,
          options: JSON.stringify(values.option),
        },
        {
          where: { id },
        }
      )
      .then((result) => {
        res.status(200).json({ message: "Poll Updated." });
      })
      .catch((err) => {
        res.status(200).json({ message: "DATA NOT FOUND!" });
      });
  }
}

module.exports = {
  getPollData,
  setPollData,
  getVoteCount,
  fetchpollData,
  EditPollData,
};
