/* 
Certificate Data on Admin
-Fetch Certificate Data for admin on certificate tab by filters  */


const { mysqlcon } = require("../../model/db");
const logg = require("../../utils/utils");



/* 
Functionality: fetchCertificate is fetching certificates data with pagination, searching and sorting and with Joins.
*/
function fetchCertificate(req, res) {
  const { search, limit, offset, sortattr, sort } = req.query
  mysqlcon.query(`SELECT cf.*,stud.first_name,stud.last_name,inst.institution_address, cr.course_name, inst.institution_name FROM certificates cf
    LEFT JOIN institutions AS inst
    ON inst.id IN (SELECT instituteId FROM students WHERE id=cf.studentId)
    LEFT JOIN courses AS cr
    ON cr.id=cf.courseId  
    LEFT JOIN students AS stud
    ON cf.studentId=stud.id
    WHERE inst.institution_name LIKE "${search ? `%${search}%` : "%%"}" 
    OR cf.certificate_key LIKE "${search ? `%${search}%` : "%%"}" 
    OR stud.first_name LIKE "${search ? `%${search}%` : "%%"}" 
    OR stud.last_name LIKE "${search ? `%${search}%` : "%%"}"
    ORDER BY ${sort && sort !== "null" ? `${sort}` : "createdAt"} 
    ${sortattr === "true" ? "ASC" : "DESC"} 
    LIMIT ${limit ? limit : 10} 
    OFFSET ${offset ? offset : 0} ;`,
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(404).json({ message: "Internal Errer!!" });
      } else {
        // res.status(200).json({ result })
        mysqlcon.query(`SELECT COUNT(*) AS total FROM certificates`, (err, count) => {
          if (err) {
            logg.error(err);
            res.status(500).json({ message: "Internal Server Error" });
          } else {
            res.status(200).json({
              message: "fetched Successfully",
              result,
              count: count[0].total,
            });
          }
        });
      }
    })
}

module.exports = fetchCertificate