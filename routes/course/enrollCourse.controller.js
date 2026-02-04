/*
   ================ Course Emrollment Control ========
   - Add Student in course
   - fetch Student progress in course
*/

const { QueryTypes } = require("sequelize");
const sequelize = require("../../database/connection");
const { mysqlcon } = require("../../model/db");
const logg = require("../../utils/utils");
const { DBMODELS } = require("../../database/models/init-models");


async function AddEnrollment(req, res) {
  const { courseId, studentId } = req.body;
  if (!courseId || !studentId)
    return res.status(404).json({ message: "404 Error invalid request" });

  try {
    const [enrollment, created] = await DBMODELS.course_enrolled.findOrCreate({
      where: { courseId, studentId },
      defaults: { courseId, studentId },
    });

    if (!created) {
      return res.status(409).json({ message: "Course Already Enrolled" });
    }
    return res.status(200).json({ message: "Course Enrolled Successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
async function GetEnrolledCourses(req, res) {
  const { studentId } = req.body;
  if (!studentId)
    return res.status(404).json({ message: "404 Error invalid request" });
  sql = `SELECT ce.id,ce.createdAt,ce.total_sections,ce.section_completed,ce.section_progress,c.id as courseId,c.course_name,c.slug,c.desc,c.thumbnail,c.author,c.category, c.course_type,c.duration,c.certification FROM course_enrolled AS ce
        INNER JOIN courses as c
        ON ce.courseId=c.id
        WHERE ce.studentId=${studentId}`;
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
      // Count Course Length
      mysqlcon.query(
        `SELECT count(sections.id) AS totalLength FROM sections
        LEFT JOIN video_documents as vdocs
        ON sections.id=vdocs.sectionId
        WHERE sections.courseId=${course.courseId}`,
        function (err, result) {
          if (err) {
            logg.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
          } else {
            let Courselength = result[0].totalLength;
            //Fetch Sections
            mysqlcon.query(
              `SELECT s.id as sectionId,s.title as section_title,s.description as section_desc,s.status as section_status,s.type as section_type FROM sections as s
        WHERE s.courseId=${course.courseId}`,
              async function (err, result) {
                if (err) {
                  logg.error(err);
                  return res
                    .status(500)
                    .json({ message: "Internal Server Error" });
                } else {
                  courseArr.push({
                    ...course,
                    sections: result,
                    course_length: Courselength,
                  });
                  if (courseArr.length == courses.length) {
                    res.status(200).json({
                      message: "Fetched Successfully",
                      courses: courseArr,
                    });
                  }
                }
              }
            );
          }
        }
      );
    });
  });
}
// ?! DEPRECATED FUNCTION FOR THE COURSE VIEW
function GetEnrolledCourseView(req, res) {
  const { studentId, courseId } = req.body;
  if (!studentId)
    return res.status(404).json({ message: "404 Error invalid request" });
  sql = `SELECT ce.id,ce.createdAt,ce.total_sections,ce.section_completed,ce.section_progress,c.id as courseId,c.course_name,c.slug,c.desc,c.thumbnail,c.author,c.category, c.course_type,c.duration,c.certification FROM course_enrolled AS ce
        INNER JOIN courses as c
        ON ce.courseId=c.id
        WHERE ce.studentId=${studentId} AND courseId=${courseId}`;
  mysqlcon.query(sql, async function (err, result) {
    if (err) {
      logg.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    let courseArr = [];
    const seriesArr = [];
    const courses = result;
    // adding sections to course Array
    if (result.length == 0) {
      res.status(200).json({ message: "Fetched Successfully", courses });
    }
    course_length = courses.length;
    function responseBhej(section_length) {
      res.status(200).json({
        message: "Fetched Successfully",
        course: { ...courseArr[0], total_sections: seriesArr.length },
        seriesArr,
      });
    }
    const course = courses[0];
    const sectionArr = [];
    mysqlcon.query(
      `SELECT s.id as sectionId,s.title as section_title,s.description as section_desc,s.status as section_status,s.type as section_type,s.order AS sectionOrder FROM sections as s
        WHERE s.courseId=${course.courseId} ORDER BY s.id ASC`,
      async function (err, result) {
        if (err) {
          logg.error(err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        sections = result;
        section_length = sections.length;
        await sections.forEach((section, sectionIndex) => {
          mysqlcon.query(
            `SELECT vd.id as seriesId,vd.title as series_title,vd.path as path,vd.status as vd_status,vd.type as vd_type,vd.status as vd_status FROM video_documents as vd
            WHERE vd.sectionId=${section.sectionId}`,
            async function (err, result) {
              if (err) {
                logg.error(err);
                return res
                  .status(500)
                  .json({ message: "Internal Server Error" });
              }
              video_documents = result;
              sectionArr.splice(sectionIndex, 0, {
                ...section,
                video_documents,
              });
              seriesArr.push(...video_documents);
              if (sections.length === sectionArr.length) {
                responseBhej();
              }
            }
          );
        });
        courseArr.push({ ...course, sectionArr });
      }
    );
  });
}
// ?! END DEPRECATED FUNCTION FOR THE COURSE VIEW
// ? NEW FUNCITON FOR FETCHING THE COURSE VIEW
async function SeriesMapper(seriesArray, cb) {
  let result = [];
  let series = [];
  function sendResponse(item) {
    if (seriesArray.length === result.length) {
      cb(result, series);
    }
  }
  for (let sectionIndex = 0; sectionIndex < seriesArray.length; sectionIndex++) {
    const section = seriesArray[sectionIndex];
    const singleSeries = await sequelize.query(
      `SELECT vd.id as seriesId,vd.title as series_title,vd.path as path,vd.status as vd_status,vd.type as vd_type,vd.sectionId as vd_sectionId FROM video_documents as vd WHERE vd.sectionId=${section.sectionId}`,
      { type: QueryTypes.SELECT }
    );
    series.push(...singleSeries);
    result.splice(sectionIndex, 0, {
      ...section,
      video_documents: singleSeries,
    });
    sendResponse();
  }
}

// ? END OF NEW FUNCITON FOR FETCHING THE COURSE VIEW

async function GetEnrolledCourseView2(req, res) {
  const { studentId, courseId } = req.body;
  if (Number(studentId) && Number(courseId)) {
    let CourseData = await sequelize.query(
      `SELECT ce.id,ce.createdAt,ce.total_sections,ce.section_completed,ce.section_progress,c.id as courseId,c.course_name,c.slug,c.desc,c.thumbnail,c.author,c.category, c.course_type,c.duration,c.certification FROM course_enrolled AS ce INNER JOIN courses as c ON ce.courseId=c.id WHERE ce.courseId=${courseId}`,
      {
        type: QueryTypes.SELECT,
      }
    );
    let seriesArr = await sequelize.query(
      `SELECT s.id as sectionId,s.title as section_title,s.description as section_desc,s.status as section_status,s.type as section_type,s.order AS sectionOrder FROM sections as s WHERE s.courseId=${courseId} ORDER BY s.id ASC`,
      { type: QueryTypes.SELECT }
    );
    // let vdArr = await sequelize.query(`SELECT  sections as s WHERE s.courseId=${courseId} ORDER BY s.id ASC`, { type: QueryTypes.SELECT })
    await SeriesMapper(seriesArr, (data, series) => {
      let Course = CourseData[0];
      res.status(200).json({
        message: "Fetched Successfully",
        course: {
          ...Course,
          sectionArr: data,
          total_sections: seriesArr.length,
        },
        seriesArr: series,
      });
    });
  } else {
    res.status(200).json({ message: "Course Not Found" });
  }
}
async function progressUpdater(req, res) {
  const { studentId, courseId, seriesId, totalLength } = req.body;
  if (!studentId || !courseId || !seriesId || !totalLength)
    return res.status(404).json({ message: "Course Not found" });
  seriesIdNum = Number(seriesId);
  mysqlcon.query(
    `SELECT id,section_progress,total_sections,section_completed FROM course_enrolled WHERE studentId=${studentId} AND courseid=${courseId}`,
    function (err, result) {
      if (err) {
        logg.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (result.length == 0)
        return res.status(404).json({ message: "Course Not Found" });
      const enrolledCourse = result[0];
      let sectionProgress = JSON.parse(enrolledCourse.section_progress);
      let progressArr = sectionProgress?.progress;
      let sectionCompleted = enrolledCourse.section_completed;
      let totalSections = enrolledCourse.total_sections;
      if (progressArr.includes(seriesIdNum)) {
        sectionProgress = {
          progress: [...progressArr],
        };
      } else {
        if (totalLength !== sectionCompleted) {
          sectionCompleted = Number(sectionCompleted) + 1;
          sectionProgress = {
            progress: [...progressArr, seriesIdNum],
          };
        }
      }
      mysqlcon.query(
        `UPDATE course_enrolled SET section_progress='${JSON.stringify(
          sectionProgress
        )}',total_sections=${totalSections},section_completed=${sectionCompleted} WHERE studentId=${studentId} AND courseid=${courseId}`,
        function (err, result) {
          if (err) {
            logg.error(err);
            res.status(500).json({ message: "Internal Server Error" });
          }
          res.status(200).json({ message: "Section Marked as Completed" });
        }
      );
    }
  );
}
async function getprogress(req, res) {
  const { studentId, courseId } = req.body;
  if (!studentId || !courseId)
    return res.status(404).json({ message: "Progress Not found" });
  mysqlcon.query(
    `SELECT * FROM course_enrolled WHERE studentId=${studentId} AND courseId=${courseId}`,
    function (err, result) {
      if (err) {
        logg.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result.length == 0)
        return res.status(404).json({ message: "Error 404 course not found" });
      return res.status(200).json({
        message: "Progress Updated",
        sectionProgress: JSON.parse(result[0].section_progress)?.progress,
        sectionCompleted: result[0].section_completed,
      });
    }
  );
}
const IsStudentEnrolled = async(req,res)=>{
  const {studentId,courseId} = req.params
  try {
    const details = await DBMODELS.course_enrolled.findOne({
      where:{
        studentId,
        courseId
      }
    })
    return res.json({
      message:"Data found.",
      details
    })
  } catch (error) {
    console.log("Error====>",error)
    return res.json({
      message:error?.message
    })
  }
}
module.exports = {
  AddEnrollment,
  GetEnrolledCourses,
  GetEnrolledCourseView: GetEnrolledCourseView2,
  progressUpdater,
  getprogress,
  IsStudentEnrolled,
};
