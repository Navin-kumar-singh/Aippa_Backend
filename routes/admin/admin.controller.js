/*
Admin Intitute related functions
 - Fetching Institute Data for admin 
 - activate & Deactivate Institute 
 - Fetch loksabha_constituency Data 
 -Registering Institute from Admin
 */
const { mysqlcon } = require("../../model/db");
const sendEmailService = require("../../service/email");
const { sendTemplatedEmail } = require("../../service/email");
const {
  hashingPassword,
  AffiliateInstitutionRegisterSchema,
} = require("../auth/validation");
const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");
const { uid } = require("uid");
const { Op } = require("sequelize");
const newSlugify = require("../../middleware/newSlugify");
const sequelize = require("../../database/connection");

/* Functionality: */
/* Functionality: getInstitutes is fetching Institutes data where limit is 10 and order By createdAt */
async function getInstitutes(req, res) {
  sql =
    "SELECT  `id`,`title`,`first_name`,`middle_name`,`last_name`,`institution_name`,`institution_address`,  `state`,  `pincode`,  `email`,  `contact`,  `created_on`,`status` FROM institutions ORDER BY createdAt LIMIT 10";
  mysqlcon.query(sql, function (err, result) {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "fetched Successfully", result });
  });
}
/* Functionality: instituteActivation Activate or Deactivate the institute from Admin. */
async function instituteActivation(req, res) {
  const { req_type } = req.query;
  const { instituteId, email } = req.body;
  if (!req_type || !instituteId) {
    return res.status(303).json({ message: "Invalid request" });
  }
  if (req_type == "activate") {
    const user = await DBMODELS.institutions.findOne({
      where: { id: instituteId, status: "verified" },
      raw: true,
    });
    sql = `UPDATE institutions SET status='active' WHERE id=${instituteId}`;
    mysqlcon.query(sql, async function (err, result) {
      if (err) {
        logg.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (user) {
        const { count } = await DBMODELS.institutions.findAndCountAll();
        var replacements = {
          username: user?.first_name,
          institute_count: count,
          institution_name: user.institution_name,
        };
        var mailConfig = {
          email,
          subject: "Welcome to Yuvamanthan, thank you for your interest",
        };
        sendEmailService.sendTemplatedEmail(mailConfig, replacements, 14);
      }
      /* --------------end-------------------------------------------- */
      return res.status(200).json({ message: "Institute Activated" });
    });
  } else if (req_type == "deactivate") {
    sql = `UPDATE institutions SET status='inactive' WHERE id=${instituteId}`;
    mysqlcon.query(sql, function (err, result) {
      if (err)
        return res.status(500).json({ message: "Internal Server Error" });
      return res.status(200).json({ message: "Institute Deactivated" });
    });
  } else {
    return res
      .status(200)
      .json({ message: "Invalid Request", data: { password } });
  }
}
/* Functionality: getData is fetching Institutes data and here We are fetching data by according to pagination and we are searching & sorting data by this function. */
async function getData(req, res) {
  const { data, limit, sort, sortattr, offset, search, role } = req.query;
  console.log(role);
  let sql;
  if (data == "institutions") {
    sql = `SELECT i.*,ia.id AS AffiliateId, ia.instituteId AS InstituteAffiliateId  FROM institutions AS i
    LEFT JOIN institute_affiliate AS ia ON i.id = ia.instituteId WHERE i.institution_name LIKE "${search ? `%${search}%` : "%%"
      }" 
    OR i.contact LIKE "${search ? `%${search}%` : "%%"}"
    OR i.first_name LIKE "${search ? `%${search}%` : "%%"}"
    OR i.last_name LIKE "${search ? `%${search}%` : "%%"}"
    OR i.institution_address LIKE "${search ? `%${search}%` : "%%"}"
    OR i.pincode LIKE "${search ? `%${search}%` : "%%"}"
    OR i.email LIKE "${search ? `%${search}%` : "%%"}"
    ORDER BY ${sort && sort !== "null" ? `i.${sort}` : "i.createdAt"}
    ${sortattr === "true" ? "ASC" : "DESC"} 
    LIMIT ${limit ? limit : 10} 
    OFFSET ${offset ? offset : 0}`;
  } else if (data == "students") {
    sql = `SELECT st.*, ins.institution_name
    FROM students as st
    LEFT JOIN institutions as ins ON st.instituteId = ins.id
    WHERE st.role = "${role}"
      AND (
        st.father_name LIKE "${search ? `%${search}%` : "%%"}" 
        OR st.contact LIKE "${search ? `%${search}%` : "%%"}"
        OR ins.institution_name LIKE "${search ? `%${search}%` : "%%"}"
        OR st.first_name LIKE "${search ? `%${search}%` : "%%"}"
        OR st.last_name LIKE "${search ? `%${search}%` : "%%"}"
        OR st.address LIKE "${search ? `%${search}%` : "%%"}"
        OR st.district LIKE "${search ? `%${search}%` : "%%"}"
        OR st.state LIKE "${search ? `%${search}%` : "%%"}"
        OR st.pincode LIKE "${search ? `%${search}%` : "%%"}"
        OR st.email LIKE "${search ? `%${search}%` : "%%"}"
      )
    ORDER BY ${sort && sort !== "null" ? `st.${sort}` : "st.createdAt"} ${sortattr === "true" ? "ASC" : "DESC"} 
    LIMIT ${limit ? limit : 10} 
    OFFSET ${offset ? offset : 0};`;
  }
  mysqlcon.query(sql, function (err, result) {
    if (err) {
      logg.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      mysqlcon.query(`SELECT COUNT(*) AS total FROM ${data} ${data == "students" ? `WHERE role="${role}"` : ""}`, (err, count) => {
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
  });
}
/* Functionality: getConstituenctData is fetching loksabha constituency data */
async function getConstituenctData(req, res) {
  sql = `SELECT * FROM loksabha_constituency`;
  mysqlcon.query(sql, function (err, result) {
    if (err) {
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "fetched Successfully", result });
    }
  });
}
/* Functionality: getOnboards is fetching data of all institutes those have completed there onboarding. */
async function getOnboards(req, res) {
  mysqlcon.query(
    `SELECT * FROM institute_onboard WHERE 1`,
    function (err, result) {
      if (err) {
        logg.error(err);
      } else {
        res.json(result[0].coordinators);
      }
    }
  );
}
/* Functionality: adminInstituionRegister is registering a new Institue from Admin side. */
async function adminInstitutionRegister(req, res) {
  try {
    const validated = AffiliateInstitutionRegisterSchema.validate(req.body);
    if (validated.error) {
      res
        .status(403)
        .json({ status: "ERROR", message: validated.error.message });
    } else {
      const result = await DBMODELS.institutions.findAll({
        attributes: ["email"],
        where: {
          [Op.or]: [
            { email: validated.value.email },
            { contact: validated.value.contact },
          ],
        },
      });

      const checkstudent = await DBMODELS.students.findAll({
        attributes: ["email"],
        where: {
          [Op.or]: [
            { email: validated.value.email },
            { contact: validated.value.contact },
          ],
        },
      });

      const checkCoord = await DBMODELS.institute_coordinators.findAll({
        attributes: ["email"],
        where: {
          [Op.or]: [
            { email: validated.value.email },
            { contact: validated.value.contact },
          ],
        },
      });
      if (
        result?.length !== 0 ||
        checkstudent?.length !== 0 ||
        checkCoord?.length !== 0
      ) {
        return res.status(409).json({
          status: "ERROR",
          message:
            "Registration with same email address OR contact already exist",
        });
      } else {
        //Check for previous Contact
        const result2 = await DBMODELS.institutions.findAll({
          attributes: ["contact"],
          where: {
            contact: validated.value.contact,
          },
        });
        let password = "@Yuva" + uid(4);
        if (result2.length !== 0) {
          return res.status(409).json({
            status: "ERROR",
            message: "Registration with same contact number already exist",
          });
        } else {
          // OTP Verification will be implemented here
          let hashPassword = await hashingPassword(password);

          //Save
          const sqlvalues = {
            title: validated.value.title,
            first_name: validated.value.first_name,
            middle_name: validated.value.middle_name,
            last_name: validated.value.last_name,
            institution_name: validated.value.institute_name,
            institution_address: validated.value.institute_address,
            state: validated.value.state,
            pincode: validated.value.pincode,
            email: validated.value.email,
            contact: validated.value.contact,
            slug: newSlugify(validated.value.institute_name),
            status: "active",
            password: hashPassword,
          };
          const result3 = await DBMODELS.institutions.create(sqlvalues);
          if (result3) {
            if (req?.body?.sendemail) {
              async function welcomeEmail() {
                const institute_count = await DBMODELS.institutions.count();
                let mailConfig = {
                  email: validated.value.email,
                  subject:
                    "Welcome to Yuvamanthan, thank you for your interest",
                };
                let replacements = {
                  name:
                    validated.value.first_name +
                    " " +
                    validated.value.last_name,
                  institute: validated.value.institute_name,
                  username: validated.value.email,
                  password: password,
                  institute_count: institute_count + 1846,
                };
                sendTemplatedEmail(mailConfig, replacements, 15);
              }
              welcomeEmail();
            }
            return res.status(200).json({
              status: "SUCCESS",
              message: `Thank you for your interest in organising Yuvamanthan Model G20 in your institution.We at Yuvamanthan are glad to have ${validated.value.institute_name} onboard with us. Please check your email for further details`,
              result: { username: validated.value.email, password: password },
            });

            // function credentailsEmail() {
            //   const replacements = {
            //     name: validated.value.first_name + " " + validated.value.last_name,
            //     username: validated.value.email,
            //     password: password,
            //   };

            //   let mailConfig = {
            //     email: validated.value.email,
            //     subject: "Congratulations! Your Yuvamanthan account has been activated!",
            //   };
            //   sendTemplatedEmail(mailConfig, replacements, 5);
            // }
            // credentailsEmail();

            // return res.status(200).json({
            //   status: "SUCCESS",
            //   message: `Thank you for your interest in organising Yuvamanthan Model G20 in your institution.We at Yuvamanthan are glad to have ${validated.value.institute_name} onboard with us. Please check your email for further details`

            // });
          }
        }
      }
    }
  } catch (err) {
    logg.error(err);
  }
}
// last 7 Days Student
async function getLast7DaysStudent(req, res) {
  const min = 10;
  const max = 50;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  try {
    const today = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const formattedDate = day.toISOString().split('T')[0];

      const registeredStudents = await DBMODELS.students.count({
        where: {
          role: 'student',
          createdAt: {
            [Op.between]: [
              new Date(day.getFullYear(), day.getMonth(), day.getDate()),
              new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
            ]
          }
        }
      });
      const registeredTeacher = await DBMODELS.students.count({
        where: {
          role: 'teacher',
          createdAt: {
            [Op.between]: [
              new Date(day.getFullYear(), day.getMonth(), day.getDate()),
              new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
            ]
          }
        }
      })
      const registeredInstitutes = await DBMODELS.institutions.count({
        where: {
          createdAt: {
            [Op.between]: [
              new Date(day.getFullYear(), day.getMonth(), day.getDate()),
              new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
            ]
          }
        }
      });

      days.push({
        name: day.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
        Student: registeredStudents,
        Teacher: registeredTeacher,
        Institute: registeredInstitutes
      });
    }

    res.json({ data: days });
  } catch (error) {
    // Handle error
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getFilteredData(req, res) {
  try {
    const { startDate, endDate, status } = req.query; // Assuming the date range and status are sent in the request body
    const institutes = await DBMODELS.institutions.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        status: status === 'all' ? { [Op.ne]: null } : status,
      },
    });

    const mixArray = await DBMODELS.students.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],

        },
        status: status === 'all' ? { [Op.ne]: null } : status,
      },
    });

    const students = mixArray.filter((i) => i.role === 'student');
    const teachers = mixArray.filter((i) => i.role === 'teacher');

    // Return the filtered data
    return res.json({ institutes, students, teachers });
  } catch (error) {
    // Handle the error
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
}



async function getLast7DaysInstitute(req, res) {
  const min = 10;
  const max = 50;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  try {
    const today = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const formattedDate = day.toISOString().split('T')[0];

      const registeredInstitutes = await DBMODELS.institutions.count({
        where: {
          createdAt: {
            [Op.between]: [
              new Date(day.getFullYear(), day.getMonth(), day.getDate()),
              new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
            ]
          }
        }
      });

      days.push({
        name: day.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
        Institute: registeredInstitutes + (Math.floor(Math.random() * (max - min + 1)) + min)
      });
    }

    res.json({ data: days });
  } catch (error) {
    // Handle error
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
// Last 7 Days Certificates
async function getLast7DaysCertificates(req, res) {
  // generate random no. 
  const min = 10;
  const max = 50;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  try {
    const today = new Date();
    const days = [];
    const certificates = await DBMODELS.certificates.findAll();
    const studentArray = await DBMODELS.students.findAll();
    let teachers = [];
    let students = [];

    certificates.forEach((certificate) => {
      const matchingStudent = studentArray.find((student) => student.id == certificate.studentId);
      if (matchingStudent) {
        if (matchingStudent.role === 'teacher') {
          teachers.push(certificate);
        } else {
          students.push(certificate);
        }
      }
    });
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const formattedDate = day.toISOString().split('T')[0];
      const registeredCertificatesTeacher = teachers.filter((certificate) => {
        return certificate.createdAt >= new Date(day.getFullYear(), day.getMonth(), day.getDate()) &&
          certificate.createdAt < new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
      }).length;

      const registeredCertificatesStudent = students.filter((certificate) => {
        return certificate.createdAt >= new Date(day.getFullYear(), day.getMonth(), day.getDate()) &&
          certificate.createdAt < new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
      }).length;

      days.push({
        name: day.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
        Teacher: registeredCertificatesTeacher,
        Student: registeredCertificatesStudent
      });
    }

    res.json({ data: days });
  } catch (error) {
    // Handle error
    res.status(500).json({ error: error.message });
  }
}
/* functionality :- deleteStudent function deletes the institute according to Id */
async function deleteStudent(req, res) {
  const { id } = req.query;
  if (id) {
    try {
      const result = await DBMODELS.students.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        success: true,
        message: "Student Deleted Successfully",
      });
    } catch (err) {
      logg.error(err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } else {
    res.status(409).json({
      success: true,
      message: "Couldn't find Student ID",
    });
  }
}
/* functionality: registerAdmin function register a new admin in table */
async function registerAdmin(req, res) {
  const { first_name, last_name, email, contact, password, role } = req.body;
  try {
    let checkEmail = await DBMODELS.admin.findOne({
      where: {
        [Op.or]: [{ email: email }, { contact: contact }],
      },
    });
    if (!checkEmail) {
      let encrypt_pass = await hashingPassword(password);
      const sqlvalues = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        contact: contact,
        password: encrypt_pass,
        role: role,
        status: "active",
      };
      const saveAdmin = await DBMODELS.admin.create(sqlvalues);
      return res.status(200).json({
        success: true,
        message: "Admin Registered Successfully",
      });
    } else {
      return res.status(409).json({
        success: false,
        message: "Account with this email or contact number already exist",
      });
    }
  } catch (err) {
    logg.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
/* functionality: getAdminsData function fetch the all admin's data from table */
async function getAdminsData(req, res) {
  try {
    const result = await DBMODELS.admin.findAll();
    return res.status(200).json({
      success: true,
      message: "Data Fetched Successfully",
      result: result,
    });
  } catch (err) {
    logg.error(err);
    return res.status(200).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
/* functionality: deleteAdmin function delete the admin according to Admin's Id */
async function deleteAdmin(req, res) {
  const { id } = req.query;
  if (id) {
    try {
      const result = await DBMODELS.admin.destroy({
        where: {
          id: id,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Deleted Successfully",
      });
    } catch (err) {
      logg.error(err);
      return res.status(200).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } else {
    res.status(404).json({
      success: true,
      message: "Couldn't find Id",
    });
  }
}
/* functionality: EditAdminRole function edit the role of admin according to Admin's Id */
async function EditAdminRole(req, res) {
  const { id } = req.query;
  const { role } = req.body;
  if ((id, role)) {
    try {
      const result = await DBMODELS.admin.update(
        { role: role },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).json({
        success: true,
        message: "Updated Successfully",
      });
    } catch (err) {
      logg.error(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } else {
    return res.status(404).json({
      success: true,
      message: "Data Not Found",
    });
  }
}
//  Function to get The Email Not Sent 
async function GetSuppresedEmail(req, res) {
  const { status, limit, sort, sortattr, offset, search } = req.query;
  let sql;
  sql = `SELECT EDel.* FROM email_deliveries as EDel
    WHERE EDel.status='${status}'
    AND ( EDel.email LIKE "${search ? `%${search}%` : "%%"}" 
    OR EDel.subject LIKE "${search ? `%${search}%` : "%%"}"
    OR EDel.details LIKE "${search ? `%${search}%` : "%%"}" )
    ORDER BY ${sort && sort !== "null" ? `EDel.${sort}` : "EDel.createdAt"} ${sortattr === "true" ? "ASC" : "DESC"} 
    LIMIT ${limit ? limit : 10}
    OFFSET ${offset ? offset : 0};`;
  mysqlcon.query(sql, function (err, result) {
    if (err) {
      logg.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      mysqlcon.query(`SELECT createdAt, COUNT(*) AS total FROM email_deliveries WHERE status='${status}';`, (err, count) => {
        if (err) {
          logg.error(err);
          res.status(500).json({ message: "Internal Server Error" });
        } else {
          res.status(200).json({
            message: "fetched Successfully",
            result,
            count: count[0]?.total ? count[0]?.total : 0,
          });
        }
      });
    }
  });
}
/* functionality :- Delee Email Record function deletes the institute according to Id */
async function DeleteSuppresedEmail(req, res) {
  const { id } = req.query;
  if (id) {
    try {
      const result = await DBMODELS.email_deliveries.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        success: true,
        message: "Email Record Deleted Successfully",
      });
    } catch (err) {
      logg.error(err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } else {
    res.status(409).json({
      success: true,
      message: "Couldn't find Email Record ID",
    });
  }
}
//  Function to get The Email Not Sent 
async function GetEmailListDomain(req, res) {
  const { limit, sort, sortattr, offset, search, type } = req.query;
  let sql;
  sql = `SELECT EList.* FROM email_list as EList
    WHERE EList.type="${type}"
    AND (
      EList.email LIKE "${search ? `%${search}%` : "%%"}" 
      OR EList.description LIKE "${search ? `%${search}%` : "%%"}"
    )
    ORDER BY ${sort && sort !== "null" ? `EList.${sort}` : "EList.createdAt"} ${sortattr === "true" ? "ASC" : "DESC"} 
    LIMIT ${limit ? limit : 10}
    OFFSET ${offset ? offset : 0};`;
  mysqlcon.query(sql, function (err, result) {
    if (err) {
      logg.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      mysqlcon.query(`SELECT COUNT(*) AS total FROM email_list;`, (err, count) => {
        if (err) {
          logg.error(err);
          res.status(500).json({ message: "Internal Server Error" });
        } else {
          res.status(200).json({
            message: "fetched Successfully",
            result,
            count: count[0]?.total ? count[0]?.total : 0,
          });
        }
      });
    }
  });
}
/* functionality :- Delee Email Record function deletes the institute according to Id */
async function DeleteEmailListDomain(req, res) {
  const { id } = req.query;
  if (id) {
    try {
      const result = await DBMODELS.email_list.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        success: true,
        message: "Email Record Deleted Successfully",
      });
    } catch (err) {
      logg.error(err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } else {
    res.status(409).json({
      success: true,
      message: "Couldn't find Email Record ID",
    });
  }
}
async function createEmailListDomain(req, res) {
  const body = req.body;
  if (body) {
    try {
      const result = await DBMODELS.email_list.create({
        email: body?.email,
        type: body?.type,
        description: body?.description
      });
      res.status(200).json({
        success: true,
        message: `Email ${body?.type} Added Successfully`,
      });
    } catch (err) {
      logg.error(err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } else {
    res.status(409).json({
      success: true,
      message: "Couldn't find Details",
    });
  }
}
async function updateEmailListDomain(req, res) {
  const body = req.body;
  if (body) {
    try {
      await DBMODELS.email_list.update({
        email: body?.email,
        type: body?.type,
        description: body?.description
      }, {
        where: {
          id: body?.id
        }
      });
      console.log()
      res.status(200).json({
        success: true,
        message: `Email ${body?.type} Updated Successfully`,
      });
    } catch (err) {
      logg.error(err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } else {
    res.status(409).json({
      success: true,
      message: "Couldn't find Details",
    });
  }
}
// Function to reset Studens Password From Admin
async function ResetStudentPassword(req, res) {
  try {
    const { password, studentId } = req.body;
    const encrypt_pass = await hashingPassword(password);
    const updatePass = await DBMODELS.students.update({ password: encrypt_pass }, {
      where: {
        id: studentId
      }
    })
    console.log(updatePass);
    return res.json({ message: "Updated Password SuccessFully" })
  } catch (error) {
    return res.json({ status: "error", message: "Error While Doing password Reset" })
  }
}
module.exports = {
  getInstitutes,
  instituteActivation,
  getData,
  getConstituenctData,
  getOnboards,
  GetSuppresedEmail,
  adminInstitutionRegister,
  deleteStudent,
  registerAdmin,
  getAdminsData,
  deleteAdmin,
  EditAdminRole,
  getLast7DaysStudent,
  getLast7DaysInstitute,
  getLast7DaysCertificates,
  DeleteSuppresedEmail,
  ResetStudentPassword,
  GetEmailListDomain,
  DeleteEmailListDomain,
  createEmailListDomain,
  updateEmailListDomain,
  getFilteredData,
};
