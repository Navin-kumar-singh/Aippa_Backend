/* 
  ========Course Control==========
  - Fetch All Courses  for Student 
  - Fetch All Section for Each Course 

*/

const { mysqlcon } = require("../../model/db");
const logg = require("../../utils/utils");

async function fetchCourse(req, res) {
  const { courseId } = req.params;
  if (!courseId) {
    res.status(404).json({ message: "Invalid Request" });
  } else {
    sql = `SELECT c.id,c.course_name,c.slug,c.desc,c.thumbnail,c.author,c.category, c.course_type,c.duration,c.certification FROM  courses as c WHERE c.id='${courseId}'`;
    mysqlcon.query(sql, function (err, result) {
      if (err) {
        logg.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      let courseArr = [];
      const courses = result;
      // adding sections to course Array
      if (result.length == 0) {
        res.status(200).json({ message: "Fetched Successfully", courses });
      }
      courses.forEach((course, i) => {
        mysqlcon.query(
          `SELECT s.id as sectionId,s.title as section_title,s.description as section_desc,s.status as section_status,s.type as section_type FROM sections as s
          WHERE s.courseId=${courseId} ORDER BY s.order ASC;`,
          async function (err, result) {
            if (err) {
              logg.error(err);
              return res.status(500).json({ message: "Internal Server Error" });
            }
            courseArr.push({ ...course, sections: result });
            if (courseArr.length == courses.length) {
              res.status(200).json({
                message: "Fetched Successfully",
                course: courseArr[0],
              });
            }
          }
        );
      });
    });
  }
}
async function GetCourses(req, res) {
  sql = `SELECT c.id,c.course_name,c.slug,c.desc,c.thumbnail,c.author,c.category, c.course_type,c.duration,c.certification FROM  courses as c`;
  mysqlcon.query(sql, function (err, result) {
    if (err) {
      logg.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    let courseArr = [];
    const courses = result;
    // adding sections to course Array
    if (result.length == 0) {
      res.status(200).json({ message: "Fetched Successfully", courses });
    }
    courses.forEach((course, i) => {
      mysqlcon.query(
        `SELECT s.id as sectionId,s.title as section_title,s.description as section_desc,s.status as section_status,s.type as section_type FROM sections as s
        WHERE s.courseId=${course.id}`,
        async function (err, result) {
          if (err) {
            logg.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
          }
          courseArr.push({ ...course, sections: result });
          if (courseArr.length == courses.length) {
            res.status(200).json({
              message: "Fetched Successfully",
              courses: courseArr,
            });
          }
        }
      );
    });
  });
}

module.exports = {
  fetchCourse,
  GetCourses,
};
