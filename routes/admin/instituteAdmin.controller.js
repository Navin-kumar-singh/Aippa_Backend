/* 
Admin's Institute tab functionalities
-Student Activate & Deavtivate 
-Get Institute Data with Joins with Institute Onboard 
-get Coordinators data 
-get Delegates data 
-get student data according to institutes 
-get certificate for particular student
*/


const { uid } = require("uid");
const { DBMODELS } = require("../../database/models/init-models");
const { mysqlcon } = require("../../model/db");
const { hashingPassword } = require("../auth/validation");
const { Op } = require("sequelize");
const sendEmailService = require("../../service/email");
const logg = require("../../utils/utils");






/* 
Functionality: getAdminInstituteData is fetching Institute data according to institutes's Id.
*/
async function getAdminInstituteData(req, res) {
  const data = req.params;
  mysqlcon.query(
    `SELECT i.*,io.* FROM institutions AS i
                LEFt JOIN institute_onboard AS io
                ON i.id=io.instituteId 
                WHERE i.id=${data.id}`,
    (err, result) => {
      if (err) {
        logg.error(err);
        res.status(500).json({
          message: "Error in Query",
        });
      } else {
        if (result[0]) {
          res.status(200).json({
            message: "Data Fetched Successfully",
            result: result[0],
          });
        }
      }
    }
  );
}


/* 
Functionality: getStudentsDataByInstitute is fetching students data from student table according to instituteId.
*/
async function getStudentsDataByInstitute(req, res) {
  const instituteId = req.params;
  mysqlcon.query(`SELECT * FROM students WHERE instituteId=${instituteId.id}`, (err, result) => {
    if (err) {
      logg.error(err);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    } else {
      res.status(200).json({
        result,
      });
    }
  });
}


/* 
Functionality: fetchStudentDelegate is fetching delegate students data from g20_delegates table according to instituteId.
*/
async function fetchStudentDelegate(req, res) {
  let instituteId = req.params;
  mysqlcon.query(`SELECT * FROM g20_delegates WHERE instituteId=${instituteId.id}`, (err, result) => {
    if (err) {
      logg.error(err);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    } else {
      return res.status(200).json({
        result,
      });
    }
  });
}



/* 
Functionality: getCoordinatorData is fetching insitiute coordinators data from institute_coordinators table according to instituteId.
*/
async function getCoordinatorData(req, res) {
  const instituteId = req.params;
  mysqlcon.query(`SELECT * FROM student_coordinators WHERE instituteId=${instituteId.id}`, (err, result) => {
    if (err) {
      logg.error(err);
      res.status(500).json({
        message: "Internal Server Error",
      });
    } else {
      res.status(200).json({
        result: result,
      });
    }
  });
}



/* 
Functionality: getStudentsCertificateData is fetching certificate data according to instituteId with Joins.
*/

async function getStudentsCertificateData(req, res) {
  const user = req.params;
  let sql = `SELECT cert.certificate_key,cert.accredited_by,cert.endorsed_by,cert.createdAt,cert.studentId,st.profile,st.first_name,st.middle_name,st.last_name
      FROM institutions as inst
      JOIN students as st ON inst.id = st.instituteId
      JOIN certificates as cert ON st.id = cert.studentId
      WHERE inst.id = '${user.id}'
      `;
  mysqlcon.query(sql, (err, result) => {
    if (err) {
      logg.error(err);
      res.status(500).json({
        message: "Internal Server Error",
      });
    } else {
      res.status(200).json({
        message: "Data Fetched Succesfully",
        result: result,
      });
    }
  });
}


/* 
Functionality: StudentActivation is activating student ro deactivating student.
*/
async function StudentActivation(req, res) {
  const { req_type } = req.query;
  const { studentId, email } = req.body;
  if (!req_type || !studentId) {
    return res.status(303).json({ message: "Invalid request" });
  }
  if (req_type == "activate") {
    sql = `UPDATE students SET status='active' WHERE id=${studentId}`;
    mysqlcon.query(sql, function (err, result) {
      if (err) {
        logg.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res.status(200).json({ message: "Student Activated" });
    });
  } else if (req_type == "deactivate") {
    sql = `UPDATE students SET status='inactive' WHERE id=${studentId}`;
    mysqlcon.query(sql, function (err, result) {
      if (err) return res.status(500).json({ message: "Internal Server Error" });
      return res.status(200).json({ message: "Student Deactivated" });
    });
  } else {
    return res.status(200).json({ message: "Invalid Request" });
  }
}

/* 
functionality :- deleteInstitute function deletes the institute according to Id
*/

async function deleteInstitute(req, res) {
  const { id } = req.query;
  if (id) {
    try {
      const result = await DBMODELS.institutions.destroy({
        where: {
          id: id
        }
      })
      res.status(200).json({
        success: true,
        message: "Institute Deleted Successfully",

      })
    } catch (err) {
      logg.error(err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error"
      })

    }
  } else {
    res.status(409).json({
      success: true,
      message: "Couldn't find Institute ID"
    })
  }
}


async function addStudent(req, res) {
  try {
    const body = req.body;
    const password = "@Yuva" + uid(4);
    const encryptedPassword = await hashingPassword(password);
    const checkCoord = await DBMODELS.institute_coordinators.findOne({
      where: {
        [Op.or]: [{ email: body.email }, { contact: body.contact }],
      },
    });
    const checkInstitute = await DBMODELS.institutions.findOne({
      where: {
        [Op.or]: [{ email: body.email }, { contact: body.contact }],
      },
    });
    const checkStudent = await DBMODELS.students.findOne({
      where: {
        [Op.or]: [{ email: body.email }, { contact: body.contact }],
      },
    });
    if (!checkCoord && !checkInstitute && !checkStudent) {
      const result = await DBMODELS.students.create({
        first_name: body?.first_name,
        last_name: body?.last_name,
        father_name: body?.father_name,
        instituteId: body?.instituteId,
        email: body?.email,
        contact: body?.contact,
        status: "active",
        password: encryptedPassword,
        dob: body?.dob,
        gender: body?.gender,

      })

      if (result) {
        if (req?.body?.sendemail) {

          const institute = await DBMODELS.institutions.findOne({
            where: {
              id: body.instituteId,
            },
          });
          const replacements = {
            name: body.first_name + " " + body.last_name,
            institute_name: institute?.institution_name,
            password,
            username: body?.email,
          };
          let mailConfig = {
            email: body.email,
            subject: "Welcome to Yuvamanthan, thank you for your interest",
            password,
          };
          sendEmailService.sendTemplatedEmail(mailConfig, replacements, 12);
        }
      }

      //End Email
      res.json({ status: "success", message: "Registered Successfully", result: { username: body?.email, password: password } });
      // }
      // }
      // );
    } else {
      res.json({ status: "error", message: "Account Already Exist" });
    }
  } catch (error) {
    logg.error(error)
    res.json({
      status: "error",
      message: "Oops Something went wrong please try again later",
    });
  }
}

module.exports = { StudentActivation, getAdminInstituteData, getCoordinatorData, fetchStudentDelegate, getStudentsDataByInstitute, getStudentsCertificateData, deleteInstitute, addStudent };

