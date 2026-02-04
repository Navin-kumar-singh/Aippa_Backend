/*
   ========== Institute Date Contol =============
   - fetch Institute date 
   - Add or Delete Affilated Institute 
   - Add institute Onboard Info.
   - fetch Student / Delegates Count 
   - fetch / Add / Delete Student Delegates 
   - fetch / Add / Delete Coordinators 
   - fetch all Certificates
   - update / fetch Institute Gallery

   //// bhaut badi file hai yr....... 
 */

const { mysqlcon } = require("../../model/db");
const sendEmailService = require("../../service/email");
const { hashingPassword } = require("../auth/validation");
const fs = require("fs");
const logg = require("../../utils/utils");
const { default: slugify } = require("slugify");
const institutions = require("../../database/models/institutions");
const sequelize = require("../../database/connection");
const dbModels = require("../../database/models/init-models");
const { DBMODELS } = require("../../database/models/init-models");
const { uid } = require("uid");
const { Op, QueryTypes } = require("sequelize");
const { s3deleteObject } = require("../../aws/s3ObjectFunctions");

// ---------------------
// ! [DEPRECATED]Get Information
// ---------------------
async function getinformation(req, res) {
  const { instituteId } = req.body;
  if (!instituteId)
    return res.status(404).json({ message: "Invalid Request not found" });
  sql =
    "SELECT  institutions.id, institutions.slug,institutions.title,  institutions.first_name,  institutions.middle_name,  institutions.last_name,  institutions.institution_name,institutions.institution_address, institutions.bio,institutions.logo, institutions.state, institutions.district ,  institutions.pincode,  institutions.email,  institutions.contact,  institutions.createdAt,institutions.status, institutions.permissions,institutions.fb,institutions.insta,institutions.lkd,institutions.twitter,institutions.ytb,io.appointment_date,io.question1 as io_q1,io.question2 as io_q2,io.question3 as io_q3,io.question4 as io_q4,io.question5 as io_q5,io.question6 as io_q6,io.question7 as io_q7,io.question8 as io_q8,io.question9 as io_q9,io.coordinators as io_coordinators FROM institutions LEFT JOIN institute_onboard as io ON institutions.id=io.instituteId WHERE institutions.id=" +
    instituteId;
  mysqlcon.query(sql, function (err, result) {
    let instituteData = result;
    if (err) {
      logg.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (result.length == 0) {
      return res.status(404).json({ message: "Institute not Found" });
    } else {
      mysqlcon.query(
        `SELECT * FROM institute_onboard WHERE instituteId=${instituteId}`,
        function (err, result) {
          if (err) {
            res.status(500).json({ message: "Internal Server Error" });
          } else {
            if (result.length === 0) {
              res.status(200).json({
                message: "fetched Successfully",
                result: instituteData,
                onboard: false,
              });
            } else {
              res.status(200).json({
                message: "fetched Successfully",
                result: instituteData,
                onboard: true,
              });
            }
          }
        }
      );
    }
  });
}
// ---------------------
// Get Information For Affiliate
// ---------------------
async function getToAffiliate(req, res) {
  const { id, limit, search } = req.query;
  if (id) {
    mysqlcon.query(
      `SELECT * FROM institutions WHERE affiliate_id=${id} AND institution_name LIKE '%${search ? search : ""
      }%' LIMIT ${limit}`,
      (error, result) => {
        if (error) {
          logg.error(error);
          res.status(500).json({
            message: "Internal Server Error",
          });
        } else {
          res.status(200).json({
            message: "Data Fetched Successfully",
            result: result,
          });
        }
      }
    );
  }
}
// ---------------------
// remvove institute For Affiliate Institutions
// ---------------------
async function removeToAffiliate(req, res) {
  const { id, instituteId } = req.query;
  //     sql = "UPDATE `students` SET `instituteId`='46' WHERE `id`=" + studentId;

  if (id) {
    mysqlcon.query(
      `UPDATE institutions SET affiliate_id='' WHERE affiliate_id='${id}' AND id='${instituteId}'
    `,
      (error, result) => {
        if (error) {
          logg.error(error);
          res.status(500).json({
            message: "Internal Server Error",
          });
        } else {
          res.status(200).json({
            message: "Institute Removed Successfully",
            result: result,
          });
        }
      }
    );
  }
}
// ---------------------
// Get Information V2
// ---------------------
async function getinformationV2(req, res) {
  const instituteId = req.user.id;
  if (!instituteId)
    return res.status(404).json({ message: "Invalid Request not found" });
  sql =
    "SELECT  institutions.id,institutions.slug,institutions.title,  institutions.first_name,  institutions.middle_name,  institutions.last_name,institutions.affiliate_id,institutions.institution_name,institutions.institution_address, institutions.bio, institutions.logo, institutions.state, institutions.district,  institutions.pincode,  institutions.email,  institutions.contact,  institutions.createdAt,institutions.status, institutions.permissions ,institutions.fb,institutions.insta,institutions.lkd,institutions.twitter,institutions.ytb,institutions.isAssigned,institutions.isPlanned,institutions.club, io.appointment_date,io.question1 as io_q1,io.question2 as io_q2,io.question3 as io_q3,io.question4 as io_q4,io.question5 as io_q5,io.question6 as io_q6,io.question7 as io_q7,io.question8 as io_q8,io.question9 as io_q9,io.theme as theme,io.coordinators as io_coordinators,aff_ins.slug AS affiliate_slug FROM institutions LEFT JOIN institute_onboard as io ON institutions.id=io.instituteId LEFT JOIN institute_affiliate as ins_aff ON institutions.affiliate_id=ins_aff.id LEFT JOIN institutions as aff_ins ON aff_ins.id=ins_aff.instituteId WHERE institutions.id=" +
    instituteId;
  mysqlcon.query(sql, function (err, result) {
    let instituteData = result;
    if (err) {
      logg.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (result.length == 0) {
      return res.status(404).json({ message: "Institute not Found" });
    } else {
      mysqlcon.query(
        `SELECT * FROM institute_onboard WHERE instituteId=${instituteId}`,
        function (err, result) {
          if (err) {
            res.status(500).json({ message: "Internal Server Error" });
          } else {
            if (result.length === 0) {
              res.status(200).json({
                message: "fetched Successfully",
                result: instituteData,
                onboard: true,
              });
            } else {
              res.status(200).json({
                message: "fetched Successfully",
                result: instituteData,
                onboard: true,
              });
            }
          }
        }
      );
    }
  });
}
// ---------------------
// Fetch Student Data
// ---------------------
async function fetchData(req, res) {
  const { instituteId } = req.body;
  const { type, search } = req.query;
  if (!instituteId || !type) {
    res.status(404).json({ message: "Invalid Request not found" });
  } else if (type == "students") {
    sql = `SELECT  st.id, st.first_name, st.middle_name,st.bio,st.last_name,st.father_name,st.address,st.state,st.pincode,st.email,st.contact, st.profile,st.dob,st.gender,st.fb,st.twitter,st.insta,st.lkd,st.ytb,
    st_on.question1 as st_q1,st_on.question2 as st_q2,
    g20_co.name as g20_country_name,g20_co.flag_icon as g20_country_flag,g20_co.slug as g20_country_slug,
    st_on.reporting_council,
    topics.id AS topicId,topics.name AS topic,
    sub_topics.id AS sub_topicId,sub_topics.title AS sub_topic
    FROM students as st 
    LEFT JOIN student_onboard as st_on 
    ON st.id=st_on.studentId 
    LEFT JOIN g20_country as g20_co 
    ON st_on.countryId=g20_co.id 
    LEFT JOIN topics
    ON st_on.topicId=topics.id
    LEFT JOIN sub_topics
    ON st_on.sub_topicId=sub_topics.id
    WHERE st.instituteId=${instituteId} AND
    st.first_name LIKE '%${search ? search : ""}%'`;
    mysqlcon.query(sql, function (err, result) {
      if (err) {
        logg.error(err);
        res.status(500).json({ message: "Internal Server Error", err });
      } else {
        res.status(200).json({ message: "fetched Successfully", result });
      }
    });
  } else {
    res.status(404).json({ message: "Invalid Request" });
  }
}
// ---------------------
// Fetch student Data Version2
// ---------------------
async function fetchDataV2(req, res) {
  let instituteId = req.user.id;
  const { type, search } = req.query;
  // Check if instituteId is provided in the query, if yes, update instituteId
  if (req.query.instituteId) {
    instituteId = req.query.instituteId;
  }
  // If type or instituteId is missing, return invalid request
  if (!type || !instituteId) {
    return res.status(404).json({ message: "Invalid Request" });
  }
  try {
    let id = { instituteId };
    // console.log(whereClause)
    // If search query is provided, apply search criteria
    if (search) {
      whereClause.first_name = { [Op.like]: `%${search}%` };
    }
    // Fetch data based on type
    if (type === "students") {
      const result = await DBMODELS.students.findAll({
        where: id,
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']],
      });
      return res.json({ result });
    } else {
      return res.status(404).json({ message: "Invalid Request" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err: err.message });
  }
}
    // sql = `SELECT  st.id, st.first_name, st.middle_name,st.bio, st.last_name,st.father_name,st.address,st.state,st.pincode,st.email,st.contact, st.profile,st.dob,st.gender,st.fb,st.twitter,st.insta,st.lkd,st.ytb,st.role,
    // FROM students as st 
    // WHERE st.instituteId=${instituteId} AND
    // st.first_name LIKE '%${search ? search : ""}%'
    // ORDER BY st_on.classOrder DESC,certified DESC`;
    // mysqlcon.query(sql, function (err, result) {
    //   if (err) {
    //     logg.error(err);
    //     res.status(500).json({ message: "Internal Server Error", err });
    //   } else {
    //     res.status(200).json({ message: "fetched Successfully", result });
    //   }
    // });

// ---------------------
// Delete Student
// ---------------------
async function deleteStudent(req, res) {
  const { studentId } = req.query;
  if (!studentId) {
    res.status(404).json({ message: "Invalid Request not found" });
  } else {
    sql = "UPDATE `students` SET `instituteId`='46' WHERE `id`=" + studentId;
    mysqlcon.query(sql, function (err, result) {
      if (err) {
        res.status(500).json({ message: "Internal Server Error", err });
        try {
          DBMODELS.g20_delegates.destroy({ where: { studentId } });
          DBMODELS.student_coordinators.destroy({ where: { studentId } });
        } catch (err) {
          console.error(err);
        }
      } else {
        res
          .status(200)
          .json({ message: "Student Deleted Successfully", result });
      }
    });
  }
}
// ---------------------
//? Add to delegates Student
// ---------------------
async function addStudentTODelegate(req, res) {
  const { studentId, instituteId } = req.body;
  if (!studentId || !instituteId)
    return res.status(404).json({ message: "Invalid Request not found" });
  mysqlcon.query(
    `INSERT INTO g20_delegates(studentId,instituteId) (SELECT '${studentId}','${instituteId}'
  WHERE NOT EXISTS( SELECT 1 FROM g20_delegates WHERE studentId=${studentId} AND instituteId=${instituteId}))`,
    function (err, result) {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error", err });
      } else if (result.affectedRows === 0) {
        return res
          .status(409)
          .json({ message: "Student Already Added to delegate" });
      } else {
        return res.status(200).json({ message: "Student Added to delegate" });
      }
    }
  );
}
// ---------------------
// ? Add to delegates Student
// ---------------------
async function deleteStudentTODelegate(req, res) {
  const { studentId } = req.query;
  if (!studentId) {
    res.status(404).json({ message: "Invalid Request not found" });
  } else {
    mysqlcon.query(
      `DELETE FROM g20_delegates WHERE studentId=${studentId}`,
      function (err, result) {
        if (err) {
          return res
            .status(500)
            .json({ message: "Internal Server Error", err });
        } else if (result.affectedRows === 0) {
          return res
            .status(409)
            .json({ message: "Student already removed from delegates" });
        } else {
          return res
            .status(200)
            .json({ message: "Student removed from delegates" });
        }
      }
    );
  }
}

// ---------------------
// functionality:- get count of delegates from g20_delegates according to instituteId.
// ---------------------

async function getCountDelegate(req, res) {
  const { instituteId } = req.body;
  if (instituteId) {
    try {
      const result = await DBMODELS.g20_delegates.findAll({
        where: {
          instituteId: instituteId,
        },
      });
      res.status(200).json({
        message: "Data Fetched Succesfully",
        result: result,
      });
    } catch (err) {
      logg.error(err);
      res.status(404).json("Inernal Server Error");
    }
  } else {
    logg.error(err);
    res.status(404).json("Couldn't Find Id");
  }
}

// ---------------------
// functionality:- get count of students from a particular institute according to instituteId.
// ---------------------

async function getCountStudent(req, res) {
  const { instituteId } = req.body;
  if (instituteId) {
    try {
      const result = await DBMODELS.students.findAll({
        where: {
          instituteId: instituteId,
        },
      });
      res.status(200).json({
        message: "Data Fetched Succesfully",
        result: result,
      });
    } catch (err) {
      logg.error(err);
      res.status(404).json("Inernal Server Error");
    }
  } else {
    res.status(404).json("Data Not Found");
  }
}

// ---------------------
// functionality:-fetchStudentTODelegate function fetches the data of delegate with joins with students table, g20_designation table, g20_Country according to instituteId and search variable. Basically we are using this function to serach and fetch the delegates data.
// -------------------
async function fetchStudentTODelegate(req, res) {
  const { instituteId } = req.body;
  const { search } = req.query;
  if (!instituteId)
    return res.status(404).json({ message: "Invalid Request not found" });
  mysqlcon.query(
    `SELECT gdel.id,gdel.studentId,gdel.countryId,gcou.flag_icon AS assigned_flag,gdel.track AS assigned_track,gdel.theme AS assigned_theme,gdel.cntry AS assigned_country,gdel.desig AS assigned_designation,
    st.first_name,st.middle_name,st.last_name,st.bio,st.father_name,st.address,st.state,st.pincode,st.email,st.contact,st.profile,st.dob,st.gender,st.fb,st.twitter,st.insta,st.lkd,st.ytb,
    gdes.name AS designation_name,gdes.slug AS designation_slug,gdes.icon AS designation_icon,
    gcou.name as country_name,gcou.slug AS country_slug,gcou.flag_icon AS country_flag
    FROM g20_delegates as gdel
    INNER JOIN students AS st
    ON st.id=gdel.studentId
    LEFT JOIN g20_designation AS gdes
    ON gdes.id=gdel.designationId
    LEFT JOIN g20_country as gcou
    ON gcou.name=gdel.cntry
    WHERE st.instituteId=${instituteId} AND
    st.first_name LIKE '%${search ? search : ""}%'`,
    function (err, result) {
      if (err) {
        logg.error(err);
        return res.status(500).json({ message: "Internal Server Error", err });
      } else if (result.affectedRows === 0) {
        return res
          .status(409)
          .json({ message: "Student Already Added to delegate" });
      } else {
        return res.status(200).json({ message: "Fetched", result });
      }
    }
  );
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
      mysqlcon.query(
        `INSERT INTO students (first_name,last_name,father_name,instituteId,email,contact,status,password,dob,gender,role)
        (SELECT '${body.first_name}','${body?.last_name ?? ""}','${body.father_name
        }','${body.instituteId}','${body.email}','${body.contact
        }','active','${encryptedPassword}','${body.dob}','${body.gender}','${body?.role
        }'
        WHERE NOT EXISTS(
          SELECT 1
          FROM students WHERE email='${body.email}' OR contact='${body.contact
        }')
      )`,
        async function (err, result) {
          if (err) {
            logg.error(err);
            res.json({ status: "error", message: "Internal Server Error" });
          } else if (result?.affectedRows === 0) {
            res.json({ status: "warning", message: "Already Registered" });
          } else {
            // Send Email
            const institute = await DBMODELS.institutions.findOne({
              where: {
                id: body.instituteId,
              },
            });
            const replacements = {
              name: body.first_name + " " + body?.last_name,
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
            //End Email
            res.json({ status: "success", message: "Registered Successfully" });
          }
        }
      );
    } else {
      res.json({ status: "error", message: "Account Already Exist" });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: "Oops Something went wrong please try again later",
    });
  }
}
// ---------------------
// Get lesser Information
// ---------------------
async function getlessinfo(req, res) {
  const { instituteId } = req.query;
  sql = "SELECT  `email` FROM institutions WHERE id=" + instituteId;
  mysqlcon.query(sql, function (err, result) {
    if (err) {
      logg.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "fetched Successfully", result });
  });
}
// ---------------------
// Update Profiles
// ---------------------
async function updateProfile(req, res) {
  const file = req.file;
  const { update_type } = req.query;
  const user = req.user;
  if (!user) {
    res.status(404).json({ message: "Institute not found" });
  } else if (update_type == "logo") {
    // Update Profile Picture
    if (!file) {
      res.status(404).json({ message: "profile Picture Not Found" });
    } else {
      let logoPic = req.file?.Location;
      DBMODELS.institutions
        .update(
          {
            logo: logoPic,
          },
          { where: { id: user.id } }
        )
        .then((result) => {
          return res.status(200).json({ message: "Institute logo Updated" });
        })
        .catch((err) => {
          logg.error(err);
          return res.status(500).json({ message: "Internal Server Error" });
        });
    }
  } else if (update_type == "basic") {
    // update Basic Details
    if (file) {
      return res.status(405).json({ message: "Method Not Allowed" });
    } else {
      const data = req.body;
      if (
        !data?.title ||
        !data?.first_name ||
        !data?.institution_name ||
        !data?.middle_name ||
        !data?.last_name ||
        !data?.contact
      ) {
        res.status(404).json({ message: "Please Fill all Fields" });
      }
      DBMODELS.institutions
        .update(data, {
          where: {
            id: user.id,
          },
        })
        .then((result) => {
          return res
            .status(200)
            .json({ message: "Profile Updated Successfully", result });
        })
        .catch((error) => {
          return res
            .status(200)
            .json({ message: "Failed to Upload Data!!!", error });
        });
    }
  } else if (update_type == "preference") {
    if (file) {
      if (fs.existsSync(file.path)) {
        // fs.unlinkSync(file.path);
      }
      res.status(405).json({ message: "Method Not Allowed" });
    } else {
      const {
        question1,
        question2,
        question3,
        question4,
        question5,
        question6,
        question7,
        question8,
        question9,
      } = req.body;
      DBMODELS.institute_onboard
        .update(
          {
            question1,
            question2,
            question3,
            question4,
            question5,
            question6,
            question7,
            question8,
            question9,
          },
          { where: { instituteId: user.id } }
        )
        .then(({ result }) => {
          return res
            .status(200)
            .json({ message: "Your Profile has been updated" });
        })
        .catch((err) => {
          logg.error(err);
          return res.status(500).json({ message: "Internal Server Error" });
        });
    }
  }
}
// ---------------------
// Get All certificates
// ---------------------
// async function getAllCertificates(req, res) {
//   const user = req.user;
//   sql = `SELECT cert.certificate_key,cert.accredited_by,cert.endorsed_by,cert.createdAt,cert.studentId,st.profile,st.first_name,st.middle_name,st.last_name
//       FROM institutions as inst
//       JOIN students as st ON inst.id = st.instituteId
//       JOIN certificates as cert ON st.id = cert.studentId
//       WHERE inst.id = '${user.id}'
//       `;
//   mysqlcon.query(sql, function (err, result) {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//     res
//       .status(200)
//       .json({ message: "Certificates Fetched Successfully", result });
//   });
// }
// ---------------------
// Onboard Institute
// ---------------------
async function instituteOnboard(req, res) {
  const body = req.body;
  const user = req.user;
  let logo;
  if (req.file?.Location) {
    logo = req.file?.Location;
  }
  let coordinators = JSON.parse(body.coordinators);
  try {
    mysqlcon.query(
      `INSERT INTO institute_onboard(question1,question2,question3,question4,question5,question6,appointment_date,deadline,theme,instituteId,createdAt,updatedAt) (SELECT '${body?.question1 ? body?.question1 : ""
      }',
      '${body?.question2 ? body?.question2 : ""}',
      '${body?.question3 ? body?.question3 : ""}',
      '${body?.question4 ? body?.question4 : ""}',
      '${body?.question5 ? body?.question5 : ""}',
      '${body?.question6 ? body?.question6 : ""}',
      '${body?.appointment_date ? body?.appointment_date : ""}',
      '${body?.deadline ? body?.deadline : body?.appointment_date}',
      '${body?.theme ? body?.theme : ""}',
      ${user.id},
      CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
      WHERE NOT EXISTS( SELECT 1 FROM institute_onboard WHERE instituteId=${user.id
      }))`,
      async function (err, result) {
        if (err) {
          logg.error(err);
          res.json({ status: "error", message: "Internal Server Error" });
        } else {
          if (result.affectedRows == 0) {
            res.json({ status: "warning", message: "Onboarding Already Done" });
          } else {
            // Query For Profile Updates
            try {
              const onBoardUpdate = await DBMODELS.institutions.update(
                {
                  logo: req.file?.Location && logo,
                  bio: body?.bio,
                  fb: body?.fb,
                  insta: body?.insta,
                  lkd: body?.lkd,
                  twitter: body?.twitter,
                  ytb: body?.ytb,
                },
                {
                  where: {
                    id: user.id,
                  },
                }
              );
              if (onBoardUpdate[0]) {
                if (coordinators.length) {
                  coordinators.forEach(async (coordinator, index) => {
                    // Account Check Success
                    const checkCoord =
                      await DBMODELS.institute_coordinators.findOne({
                        where: {
                          [Op.or]: [
                            { email: coordinator.email },
                            { contact: coordinator.contact },
                          ],
                        },
                      });
                    const checkInstitute = await DBMODELS.institutions.findOne({
                      where: {
                        [Op.or]: [
                          { email: coordinator.email },
                          { contact: coordinator.contact },
                        ],
                      },
                    });
                    const checkStudent = await DBMODELS.students.findOne({
                      where: {
                        [Op.or]: [
                          { email: coordinator.email },
                          { contact: coordinator.contact },
                        ],
                      },
                    });
                    if (!checkCoord && !checkInstitute && !checkStudent) {
                      const password = "@Yuva" + uid(4);
                      const encPass = await hashingPassword(password);
                      const addCoord =
                        await DBMODELS.institute_coordinators.upsert({
                          name: coordinator.name,
                          email: coordinator.email,
                          contact: coordinator.contact,
                          designation: coordinator.designation,
                          instituteId: user.id,
                          password: encPass,
                        });
                      let mailConfig = {
                        email: coordinator.email,
                        subject:
                          "Congrats! You are appointed as Teacher Coordinator",
                        password,
                      };
                      let replacements = {
                        name: coordinator.name,
                        email: coordinator.email,
                        password,
                      };
                      sendEmailService.sendTemplatedEmail(
                        mailConfig,
                        replacements,
                        3
                      );
                    }
                  });
                }
                // Onboard Complete
                if (result.affectedRows !== 0) {
                  res.json({
                    status: "success",
                    message: "Onboarding Complete Redirecting to Dashboard",
                  });
                } else {
                  res.json({
                    error: "error",
                    message: "Institute Not Found",
                  });
                }
              }
            } catch (error) {
              if (error) {
                logg.error(error);
                res.json({
                  status: "error",
                  message: "Internal Server Error",
                });
              }
            }
          }
        }
      }
    );
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
}

async function instituteEventUpdate(req, res) {
  const { Date, deadline, theme } = req.body;
  const { id } = req.query;
  try {
    if ((id, req.body)) {
      const result = await DBMODELS.institute_onboard.update(
        { appointment_date: Date, deadline, theme },
        {
          where: {
            instituteId: id,
          },
        }
      );
      return res.status(200).json({
        success: true,
        message: "Data Posted Successfully",
        result: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Data Not Found",
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

async function instituteGetEventDate(req, res) {
  const { id } = req.query;
  try {
    if (id) {
      const result = await DBMODELS.institute_onboard.findAll({
        where: {
          instituteId: id,
        },
        attributes: ["appointment_date", "deadline", "theme"],
      });
      return res.status(200).json({
        success: true,
        message: "data Fteched Successfully",
        result: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Data Not Found",
      });
    }
  } catch (err) {
    logg.error(err);
    return res.status(404).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
// ---------------------
//TODO Onboard Institute
// ---------------------
async function updateOnboard(req, res) {
  const { data, attr } = req.body;
  const user = req.user;
  if (data && attr) {
    mysqlcon.query(
      `UPDATE institute_onboard SET ${attr}='${data}' WHERE instituteId=${user.id} `,
      function (err, result) {
        if (err) {
          logg.error(err);
          res.status(200).json({ message: "Internal Server Error" });
        } else {
          res.status(200).json({ message: "Updated Successfully" });
        }
      }
    );
  } else {
    res.status(404).json({ message: "Invalid request" });
  }
}
async function getGallery(req, res) {
  const { id } = req.params;
  if (id) {
    try {
      const data = await DBMODELS.institute_gallery.findAll({
        where: {
          instituteId: id,
        },
      });
      res.status(200).json({
        message: "Fetched All Resources",
        result: data,
      });
    } catch (error) {
      logg.error(error);
      res.status(500).json({
        message: "Internal Server Srror",
      });
    }
  } else {
    res.status(404).json({
      message: "Data Not Found",
    });
  }
}

async function postGallery(req, res) {
  const { id } = req.params;
  const { alttext } = req.body;
  if (id && req?.file?.Location) {
    try {
      const data = await DBMODELS.institute_gallery.create({
        img: req.file?.Location,
        alttext,
        instituteId: id,
      });
      res
        .status(200)
        .json({ message: "Data Posted Successfully", result: data });
    } catch (error) {
      logg.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    logg.error("Data missing");
    res.status(404).json({
      message: "Data Not Found",
    });
  }
}

async function updateGallery(req, res) {
  const { alttext, id } = req.body;
  if (req?.file?.Location) {
    if (id) {
      try {
        const data = await DBMODELS.institute_gallery.update(
          {
            img: req.file?.Location,
            alttext,
          },
          {
            where: {
              id: id,
            },
          }
        );
        res
          .status(200)
          .json({ message: "Data Updated Sucessfully", result: data });
      } catch (error) {
        logg.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    } else {
      res.status(404).json({
        message: "Data Not Found",
      });
    }
  } else {
    res.status(404).json({
      message: "Data Not Found",
    });
  }
}

async function deleteGallery(req, res) {
  const { id } = req.query;
  if (id) {
    try {
      const { img } = await DBMODELS.institute_gallery.findByPk(id);
      if (img) {
        s3deleteObject(img);
      }
      const data = await DBMODELS.institute_gallery.destroy({ where: { id } });
      res.status(200).json({
        message: "Data Deleted Succesfully",
        result: data,
      });
    } catch (error) {
      logg.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(404).json({
      message: "Data Not Found",
    });
  }
}


const fetchAllInstitutes = async (req, res) => {
  try {
    const institutes = await DBMODELS.institutions.findAll()
    return res.json({
      message: "fetched all",
      allInsitute: institutes,
    })
  } catch (error) {
    res.status(500).json({ error: 'Error fetching institute: ' + error.message });
  }
}

const updateInstitute = async (req, res) => {
  const { instituteId } = req.params;
  const body = req.body;
  try {
    const institute = await DBMODELS.institutions.findByPk(instituteId);
    if (!institute) {
      return res.status(403).json({ message: 'not a institute' })
    }
    // Update the student attributes dynamically based on the request body
    Object.keys(body).forEach((attributeName) => {
      institute[attributeName] = body[attributeName];
    });

    // Save the updated student to the database
    await institute.save();

    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    logg.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// ---------------------
// Get All Enrolleds
// ---------------------
async function getAllEnrollments(req, res) {
  try {
    const user = req.user;
    const { role } = req?.query;
    const Enrollments = await sequelize.query(`SELECT course.course_name,course.thumbnail,course.author,course_en.createdAt,course_en.studentId,st.profile,st.first_name,st.last_name,st.role
    FROM institutions as inst
    JOIN students as st ON inst.id = st.instituteId
    JOIN course_enrolled as course_en ON st.id = course_en.studentId
    JOIN courses as course ON course_en.id=course.id
    WHERE inst.id='${user.id}' AND st.role='${role}'`, { type: QueryTypes.SELECT, raw: true })
    return res.json({ status: "success", message: "Certificates Fetched Successfully", result: Enrollments });
  } catch (error) {
    logg.error(error);
    return res.json({ status: "error", message: "Oops Something Went Wrong" })
  }
}

// ---------------------
// Get All certificates
// ---------------------
async function getAllCertificates(req, res) {
  try {
    const user = req.user;
    const { role } = req?.query;
    const Certificates = await sequelize.query(`SELECT cert.certificate_key,cert.accredited_by,cert.endorsed_by,cert.createdAt,cert.studentId,st.profile,st.first_name,st.last_name,st.role
    FROM institutions as inst
    JOIN students as st ON inst.id = st.instituteId
    JOIN certificates as cert ON st.id = cert.studentId
    WHERE inst.id='${user.id}' AND role='${role}'`, { type: QueryTypes.SELECT, raw: true })
    return res.json({ status: "success", message: "Certificates Fetched Successfully", result: Certificates });
  } catch (error) {
    logg.error(error);
    return res.json({ status: "error", message: "Oops Something Went Wrong" })
  }
}
module.exports = {
  updateInstitute,
  fetchAllInstitutes,
  getinformation,
  getToAffiliate,
  removeToAffiliate,
  getinformationV2,
  getlessinfo,
  fetchData,
  fetchDataV2,
  deleteStudent,
  updateProfile,
  instituteOnboard,
  addStudentTODelegate,
  fetchStudentTODelegate,
  deleteStudentTODelegate,
  updateOnboard,
  getGallery,
  postGallery,
  updateGallery,
  deleteGallery,
  getCountDelegate,
  getCountStudent,
  addStudent,
  instituteEventUpdate,
  instituteGetEventDate,
  getAllEnrollments,
  getAllCertificates
};
