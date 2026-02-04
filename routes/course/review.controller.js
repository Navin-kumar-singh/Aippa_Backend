/*
  ----------------Review Control ------------ 
  - Store reviews of Student on the Course
  - fetch reviews for the Course page.
  */
const { mysqlcon } = require("../../model/db");
const moment = require("moment");
const logg = require("../../utils/utils");

async function postReview(req, res) {
  const { title, description, rating, courseId, userId } = req.body;
  let timestamp = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  if ((title, description, rating, courseId, userId)) {
    mysqlcon.query(
      `INSERT INTO course_review (title,description,rating,courseId,studentId,createdAt) (SELECT '${title}','${description}','${rating}','${courseId}','${userId}','${timestamp}' WHERE NOT EXISTS(SELECT 1 FROM course_review WHERE courseId=${courseId} AND studentId=${userId}))`,
      function (err, result) {
        if (err) {
          logg.error(err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        if (result.affectedRows == 0) {
          return res.status(409).json({ message: "Already Reviewed" });
        }
        return res
          .status(200)
          .json({ message: "Review Submitted Successfully" });
      }
    );
  } else {
    res.status(404).json({ message: "404 Invalid Request" });
  }
}
async function fetchReview(req, res) {
  const { courseId } = req.query;
  if (courseId) {
    mysqlcon.query(
      `SELECT course_review.*,s.first_name,s.last_name,s.profile,ins.institution_name FROM course_review
       INNER JOIN students AS s
       ON s.id=course_review.studentId
       LEFT JOIN institutions AS ins
       ON s.instituteId=ins.id
       WHERE course_review.courseId=${courseId} `,
      function (err, result) {
        if (err) {
          logg.error(err);
          return res.status(500).json({ message: err });
        }
        return res.status(200).json({ message: result });
      }
    );
  } else {
    res.status(404).json({ message: "404 Invalid Request" });
  }
}

module.exports = {
  postReview,
  fetchReview,
};
