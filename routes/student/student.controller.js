/*
  ====== Student contol ======
  - fetch / update Student 
  - Add Participanets
  - Add Student Onboard Details
 */
const { mysqlcon } = require("../../model/db");
const fs = require("fs");
const moment = require("moment");
const logg = require("../../utils/utils");
const sequelize = require("../../database/connection");
const { QueryTypes, Op } = require("sequelize");
const { DBMODELS } = require("../../database/models/init-models");
const { s3deleteObject } = require("../../aws/s3ObjectFunctions");
const { log } = require("console");
const randomAvatar = [
  "https://yuvamanthan.s3.ap-south-1.amazonaws.com/static/avatar/avatar1.jpg",
  "https://yuvamanthan.s3.ap-south-1.amazonaws.com/static/avatar/avatar2.jpg",
  "https://yuvamanthan.s3.ap-south-1.amazonaws.com/static/avatar/avatar3.jpg",
  "https://yuvamanthan.s3.ap-south-1.amazonaws.com/static/avatar/avatar4.jpg",
  "https://yuvamanthan.s3.ap-south-1.amazonaws.com/static/avatar/avatar5.jpg",
];

const updateStudent = async (req, res) => {
  const { studentId } = req.params;
  const body = req.body;
  try {
    const student = await DBMODELS.students.findByPk(studentId);
    if (!student) {
      return res.status(403).json({ message: "not a student" });
    }
    // Update the student attributes dynamically based on the request body
    Object.keys(body).forEach((attributeName) => {
      student[attributeName] = body[attributeName];
    });

    // Save the updated student to the database
    await student.save();

    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    logg.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchAll = async (req, res) => {
  try {
    const students = await DBMODELS.students.findAll();
    return res.json({
      message: "fetched all",
      allStudent: students,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching students: " + error.message });
  }
};

async function fetchDetails(req, res) {
  const User = req.user;
  if (User.type == "0") {
    const studentData = await sequelize.query(
      `SELECT std.id, std.first_name, std.middle_name, std.last_name,std.bio,std.father_name,std.instituteId,std.address,std.state,std.pincode,std.email,std.contact,std.status,std.district,std.profile,std.banner,std.gender,std.dob,std.fb,std.twitter,std.insta,std.ytb,std.lkd,std.permission,
    ins.institution_name,ins.institution_address,ins.logo,ins.state as instituteState,ins.pincode as institutePincode, ins.bio as instituteBio, ins.logo as instituteLogo,
    so.reporting_council,so.id as onboard_check, so.class,
    topics.id AS topicId,topics.name AS topic,
    sub_topics.id AS sub_topicId,sub_topics.title AS sub_topic,
    gdel.track AS g20_track,gdel.theme AS g20_theme,gdel.cntry AS g20_country,gdel.desig AS g20_designation,gcou.flag_icon AS flag,
    studcoor.id as coordinator_check,
    inon.appointment_date as event_date,inon.deadline as event_deadline
    FROM students as std
    LEFT JOIN institutions AS ins
    ON std.instituteId=ins.id
    LEFT JOIN student_onboard as so
    ON so.studentId=std.id
    LEFT JOIN institute_onboard as inon
    ON inon.instituteId=std.instituteId
    LEFT JOIN topics
    ON so.topicId=topics.id
    LEFT JOIN sub_topics
    ON so.sub_topicId=sub_topics.id
    LEFT JOIN g20_delegates as gdel
    ON gdel.studentId=std.id
    LEFT JOIN g20_country AS gcou
    ON gcou.name=gdel.cntry
    LEFT JOIN student_coordinators as studcoor
    ON studcoor.studentId=std.id
    WHERE std.email='${User.email}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
    let student = studentData[0];
    if (student?.onboard_check) {
      res.status(200).json({
        message: "Details Found",
        result: studentData,
        onboard: true,
      });
    } else {
      res.status(200).json({
        message: "Details Found",
        result: studentData,
        onboard: false,
      });
    }
  } else {
    res
      .status(403)
      .json({ message: "You are not Authorized to access details" });
  }
}

function classWiseOrder(orderClass) {
  switch (orderClass) {
    case "below 6th":
      return 1;
      break;
    case "6th":
      return 2;
      break;
    case "7th":
      return 3;
      break;
    case "8th":
      return 4;
      break;
    case "8th":
      return 5;
      break;
    case "9th":
      return 6;
      break;
    case "10th":
      return 7;
      break;
    case "11th":
      return 8;
      break;
    case "12th":
      return 9;
      break;
    case "diploma":
      return 10;
      break;
    case "graduation":
      return 11;
      break;
    case "post-graduation":
      return 12;
      break;
    case "doctorate":
      return 13;
      break;
    default:
      return 0;
      break;
  }
}

async function updateProfile(req, res) {
  const file = req.file;
  const { update_type } = req.query;
  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: "Student not found" });
  } else if (update_type == "profile_pic") {
    // Update Profile Picture
    const { profile } = req.body;
    if (!file)
      return res.status(404).json({ message: "profile Picture Not Found" });
    /*************Delete previous profile Img *************/
    const resposne = await DBMODELS.students.findByPk(user.id);
    s3deleteObject(resposne.profile);
    mysqlcon.query(
      `UPDATE students SET profile='${file?.Location}' WHERE id=${user.id}`,
      function (err, result) {
        if (err) {
          logg.error(err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        if (profile) {
          if (fs.existsSync(profile)) {
            // fs.unlinkSync(profile);
          }
        }
        return res.status(200).json({ message: "Profile Image Updated" });
      }
    );
  } else if (update_type == "basic") {
    //update basic
    if (file) {
      if (fs.existsSync(file.path)) {
        // fs.unlinkSync(file.path);
      }
      return res.status(405).json({ message: "Method Not Allowed" });
    }
    const { first_name, last_name, email, contact, father_name, gender, dob } =
      req.body;
    if (
      !first_name ||
      !last_name ||
      !email ||
      !contact ||
      !father_name ||
      !gender ||
      !dob
    ) {
      return res.status(404).json({ message: "Please Fill Form Completely" });
    } else {
      mysqlcon.query(
        `UPDATE students SET first_name='${first_name}',last_name='${last_name}',contact='${contact}',father_name='${father_name}',dob='${dob}',gender='${gender}' WHERE id=${user.id}`,
        async function (err, result) {
          if (err) {
            logg.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
          } else {
            try {
              const updateClass = await DBMODELS.student_onboard.update(
                {
                  class: req?.body?.class,
                  classOrder: classWiseOrder(req?.body?.class),
                },
                {
                  where: {
                    studentId: user?.id,
                  },
                }
              );
            } catch (err) {
              logg.error(err);
            }

            return res
              .status(200)
              .json({ message: "Profile Updated Successfully" });
          }
        }
      );
    }
  } else if (update_type == "additional") {
    //update Additional
    if (file) {
      if (fs.existsSync(file.path)) {
        // fs.unlinkSync(file.path);
      }
      return res.status(405).json({ message: "Method Not Allowed" });
    }
    const {
      fb,
      twitter,
      insta,
      ytb,
      lkd,
      bio,
      address,
      district,
      state,
      pincode,
    } = req.body;
    if (!address || !state || !pincode || !district) {
      return res
        .status(404)
        .json({ message: "Please Fill all required fields" });
    }
    mysqlcon.query(
      `UPDATE students SET bio='${bio}',address='${address}',state='${state}',district='${district}',pincode='${pincode}',fb='${fb}',twitter='${twitter}',insta='${insta}',lkd='${lkd}',ytb='${ytb}' WHERE id=${user.id}`,
      function (err, result) {
        if (err) {
          logg.error(err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        return res
          .status(200)
          .json({ message: "Profile Updated Successfully" });
      }
    );
  } else if (update_type == "preference") {
    //update preference
    if (file) {
      res.status(405).json({ message: "Method Not Allowed" });
    } else {
      const { topicId, reporting_council, sub_topicId } = req.body;
      if (!topicId || !reporting_council || !sub_topicId) {
        res.status(404).json({ message: "Please Fill Form Completely" });
      } else {
        mysqlcon.query(
          `UPDATE student_onboard SET topicId='${topicId}',sub_topicId='${sub_topicId}',reporting_council='${reporting_council}' WHERE studentId=${user.id}`,
          function (err, result) {
            if (err) {
              logg.error(err);
              res.status(500).json({ message: "Internal Server Error" });
            } else {
              res.status(200).json({ message: "Profile Updated Successfully" });
            }
          }
        );
      }
    }
  }
}

async function studentOnboard(req, res) {
  const body = req.body;
  let timestamp = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  let profile = req?.file?.Location
    ? req?.file?.Location
    : randomAvatar[Math.floor(Math.random() * 5) + 1];
  const user = req.user;
  mysqlcon.query(
    `INSERT INTO student_onboard(question1,question2,question3,class,classOrder,studentId,createdAt,updatedAt) (SELECT '${body?.question1 ? body?.question1 : ""
    }','${body?.question2 ? body?.question2 : ""}','${body?.question3 ? body?.question3 : ""
    }','${body?.class ? body?.class : ""}','${classWiseOrder(body?.class)}',${user.id
    },'${timestamp}','${timestamp}' WHERE NOT EXISTS( SELECT 1 FROM student_onboard WHERE studentId=${user.id
    }))`,
    async function (err, result) {
      if (err) {
        logg.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        if (result.affectedRows == 0) {
          res.status(409).json({ message: "Onboarding Already Done" });
        } else {
          mysqlcon.query(
            `UPDATE students SET 
            profile='${profile}',
            bio='${body?.bio ? body?.bio : ""}',
            fb='${body?.fb ? body?.fb : ""}',
            insta='${body?.insta ? body?.insta : ""}',
            lkd='${body?.lkd ? body?.lkd : ""}',
            twitter='${body?.twitter ? body?.twitter : ""}',
            ytb='${body?.ytb ? body?.ytb : ""}',
            updatedAt='${timestamp}'
            WHERE id=${user.id}`,
            function (err, result) {
              if (err) {
                logg.error(err);
                res.status(500).json({ message: "Internal Server Error" });
              } else {
                if (result.affectedRows !== 0) {
                  res.status(200).json({
                    message: "Onboarding Complete Redirecting to Dashboard",
                  });
                } else {
                  res.status(404).json({
                    message: "Institute Not Found",
                  });
                }
              }
            }
          );
        }
      }
    }
  );
}
const DesignationArray = [
  "Head of State",
  "Finance Minister",
  "Foreign Minister",
  "Sherpa",
  "Central Bank Governor",
  "Senior Advisor",
  "Sous-Sherpa",
];
const CountryArray = [
  "Argentina",
  "Australia",
  "Brazil",
  "Canada",
  "China",
  "France",
  "Germany",
  "India",
  "Indonesia",
  "Italy",
  "Japan",
  "The Republic of Korea",
  "Mexico",
  "Russia",
  "Saudi Arabia",
  "South Africa",
  "Turkey",
  "The United Kingdom",
  "The United States",
  "The European Union",
];
const ArraySuffle = (unshuffled) => {
  let shuffled = unshuffled
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  return shuffled;
};
const CombinationMaker = (arr1, arr2, arr3, cb) => {
  let stop = false;
  let result = null;
  for (let i = 0; i < arr1.length && !stop; i++) {
    const desig = arr1[i];
    const suffledCountries = ArraySuffle(arr2);
    for (let j = 0; j < suffledCountries.length && !stop; j++) {
      const country = suffledCountries[j];
      const checkAlloted = arr3.findIndex(
        (ele) => ele.cntry === country && ele.desig === desig
      );
      if (checkAlloted < 0) {
        cb({ desig, cntry: country });
        stop = true;
      } else if (arr1.length === i + 1 && suffledCountries.length === j + 1) {
        cb(false);
      }
    }
  }
};

async function applyForParticipation(req, res) {
  try {
    const { studentId, user } = req.body;
    let student = null;
    if (studentId) {
      student = await DBMODELS.students.findOne({
        where: {
          id: studentId,
        },
      });
    }
    const instituteId = student?.instituteId;
    if (studentId && instituteId) {
      // Checking the institute Deadline
      const deadLineDate = await DBMODELS.institute_onboard.findOne({
        where: {
          instituteId,
        },
        raw: true,
        attributes: ["id", "appointment_date", "deadline"],
      });
      const todayDate = moment().format("YYYY-MM-DD");
      const deadline = moment(deadLineDate?.deadline).format("YYYY-MM-DD");
      const event_date = moment(deadLineDate?.appointment_date).format(
        "YYYY-MM-DD"
      );
      let checkDates =
        moment(deadline).isBefore(todayDate) ||
        moment(event_date).isBefore(todayDate);
      if (!checkDates || user === "INSTITUTE") {
        // Checking Old Allotments
        const OldAllotments = await DBMODELS.g20_delegates.findAll({
          where: {
            instituteId,
            [Op.or]: {
              cntry: {
                [Op.ne]: null,
              },
              cntry: {
                [Op.ne]: "",
              },
            },
            [Op.or]: {
              desig: {
                [Op.ne]: null,
              },
              desig: {
                [Op.ne]: "",
              },
            },
          },
          attributes: ["cntry", "desig"],
        });
        const Alloted = OldAllotments;
        CombinationMaker(
          DesignationArray,
          CountryArray,
          Alloted,
          async (result) => {
            if (result) {
              const checkAllotedorNot = await DBMODELS.g20_delegates.count({
                where: {
                  studentId,
                  [Op.or]: {
                    cntry: {
                      [Op.ne]: null,
                    },
                    cntry: {
                      [Op.ne]: "",
                    },
                  },
                  [Op.or]: {
                    desig: {
                      [Op.ne]: null,
                    },
                    desig: {
                      [Op.ne]: "",
                    },
                  },
                },
              });
              if (checkAllotedorNot) {
                return res.json({
                  status: "conflict",
                  message: "Already Applied for Participation.",
                });
              } else {
                const studentAvail = await DBMODELS.g20_delegates.findOne({
                  where: {
                    studentId,
                  },
                });
                if (studentAvail) {
                  const updateDelegate = await DBMODELS.g20_delegates.update(
                    result,
                    {
                      where: {
                        studentId,
                      },
                    }
                  );
                  return res.json({
                    updateDelegate,
                    status: "success",
                    message:
                      "Your application submitted for being a G20 Delegate",
                  });
                } else {
                  const createDelegate = await DBMODELS.g20_delegates.create({
                    ...result,
                    studentId,
                    instituteId,
                  });
                  return res.json({
                    createDelegate,
                    status: "success",
                    message:
                      "Your application submitted for being a G20 Delegate",
                  });
                }
              }
            } else {
              res.json({
                status: "warning",
                message: "All Allotments are done for your Institution.",
              });
            }
          }
        );
      } else {
        res.json({
          status: "warning",
          message: "Deadline Exceeded for participation.",
        });
      }
    } else {
      return res.json({
        status: "error",
        message: "You are Required to be a part of institution.",
      });
    }
  } catch (error) {
    logg.error(error);
    if (error) {
      return res.json({
        status: "error",
        message: "Somthing Went Wrong try Again Later",
      });
    }
  }
}

async function getEductaionType(req, res) {
  const { instituteId } = req.query;
  try {
    if (instituteId) {
      const result = await DBMODELS.institute_onboard.findAll({
        attributes: ["question2"],
        where: {
          instituteId: instituteId,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Data Fetched Successfully",
        result: result,
      });
    } else {
      res.status(409).json({
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
module.exports = {
  applyForParticipation,
  fetchDetails,
  updateProfile,
  studentOnboard,
  getEductaionType,
  fetchAll,
  updateStudent,
};
