const { mysqlcon } = require("../../model/db");
const { DBMODELS } = require("../../database/models/init-models");
const sequelize = require("../../database/connection");
const { where } = require("sequelize");
const countryData = require("./countryWiseState.json");
const sendEmailService = require("../../service/email");
const xlsx = require("xlsx");
const logg = require("../../utils/utils");

// check onBoard status

const checkOnBoardStatus = async (req, res) => {
  const { email } = req.params;
  try {
    const institute = await DBMODELS.institute_reg_details.findOne({
      where: {
        email,
      },
    });
    if (institute) {
      let status = institute.on_board_status;

      return res.json({
        result: status,
      });
    } else {
      return res.json({
        message: "no institute found",
      });
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

function fetchStudentDetails(req, res) {
  const { searchTerm, limit, offset } = req.query;
  console.log(searchTerm, limit, offset, "data response");
  try {
    let sql;
    if (searchTerm !== "") {
      sql = `Select st.*,stBoard.question1,stBoard.question2,stBoard.question3,stBoard.class FROM students as st LEFT JOIN student_onboard AS stBoard ON st.id = stBoard.studentId WHERE role = "student" AND st.first_name LIKE "${
        searchTerm ? `%${searchTerm}%` : "%%"
      }" LIMIT ${limit ? limit : 10} 
        OFFSET ${offset ? offset : 0}`;
      console.log(sql);
    } else {
      sql = `Select st.*,stBoard.question1,stBoard.question2,stBoard.question3,stBoard.class FROM students as st LEFT JOIN student_onboard AS stBoard ON st.id = stBoard.studentId WHERE role = "student"  LIMIT ${
        limit ? limit : 10
      } 
        OFFSET ${offset ? offset : 0}`;
      console.log(sql);
    }
    mysqlcon.query(sql, function (err, result) {
      if (err) {
        logg.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        mysqlcon.query(
          `SELECT COUNT(*) AS total FROM students WHERE role ="student" AND students.first_name LIKE "${
            searchTerm ? `%${searchTerm}%` : "%%"
          }"`,
          (err, count) => {
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
          }
        );
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.response,
    });
  }
}

function deleteStudentDetails(req, res) {
  const { studentId } = req.query;
  if (!studentId) {
    return res.status(404).json({ message: "Invalid Request not found" });
  }
  try {
    let sql;
    sql = `DELETE FROM student_onboard WHERE studentId = ${studentId}`;

    console.log(sql, "sql query==>");

    mysqlcon.query(sql, (err, resultOnboard) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Error deleting student_onboarding", error: err });
      }
      sql = `DELETE FROM students WHERE id=${studentId}`;
      mysqlcon.query(sql, (err, resultStudent) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Error deleting student", error: err });
        }
        res.status(200).json({
          message: "Student and student Onboard deleted successfully",
        });
      });
    });
  } catch (error) {
    console.error(error, "catch block==>");
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

// get all institute

const getAllInstitute = async (req, res) => {
  try {
    const allInstitute = await DBMODELS.institutions.findAll({
      attributes: [
        "id",
        "institution_name",
        "logo",
        "district",
        "state",
        "pincode",
        "email",
        "contact",
        "institution_name",
        "bio",
        "first_name",
        "last_name",
        [sequelize.col("institution_name"), "value"],
        [
          sequelize.literal(`(
          COALESCE(
            (    select concat(street, ' ', city)
            from institute_reg_details
            where institutions.id = institute_reg_details.institute_id),
            (
              select institution_address
              from dual
            )
          )
        )`),
          "address",
        ],
        [
          sequelize.literal(`(
          select count(*)
          from students where students.instituteId=institutions.id and students.role='student'
        )`),
          "totalStudent",
        ],
        [
          sequelize.literal(`(
          select count(*)
          from students where students.instituteId=institutions.id and students.role='teacher'
        )`),
          "totalTeacher",
        ],
        [
          sequelize.literal(`(
          select website
          from institute_reg_details where institute_reg_details.institute_id=institutions.id
        )`),
          "website",
        ],
        [
          sequelize.literal(`(
          select designation
          from institute_reg_details where institute_reg_details.institute_id=institutions.id
        )`),
          "designation",
        ],
        [
          sequelize.literal(`(
          select medium_of_education
          from institute_reg_details where institute_reg_details.institute_id=institutions.id
        )`),
          "medium_of_education",
        ],
        [
          sequelize.literal(`(
          select medium_of_education
          from institute_reg_details where institute_reg_details.institute_id=institutions.id
        )`),
          "medium_of_education",
        ],
        [
          sequelize.literal(`(
          select type_of_inst
          from institute_reg_details where institute_reg_details.institute_id=institutions.id
        )`),
          "type_of_inst",
        ],
      ],
    });
    return res.status(200).json({
      message: "all institute data",
      result: allInstitute,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

// get insitute manager detail

const getInstituteManager = async (req, res) => {
  const { instituteId } = req.params;
  try {
    const allManager = await DBMODELS.institute_account_manager.findAll({
      where: {
        instituteId,
      },
    });
    return res.status(200).json({
      result: allManager,
    });
  } catch (error) {
    return res.json(error.message);
  }
};

const getAllUsers = async (req, res) => {
  const { instituteId } = req.params;
  try {
    const allUsers = await DBMODELS.students.findAll({
      where: {
        instituteId,
      },
      attributes: [
        "id",
        "first_name",
        "last_name",
        "role",
        "profile",
        [
          sequelize.literal(`(
          IF(
              EXISTS (
                  SELECT is_account_verified
                  FROM student_reg_details
                  WHERE student_reg_details.student_id = students.id
              ) OR
              EXISTS (
                  SELECT is_account_verified
                  FROM teacher_reg_details
                  WHERE teacher_reg_details.student_id = students.id
              ) OR
              EXISTS (
                  SELECT id
                  FROM student_onboard
                  WHERE student_onboard.studentId = students.id
              ),
              TRUE,
              FALSE
          )
      )`),
          "status",
        ],
      ],
    });
    return res.json({
      message: "Succesfully fetched",
      allUsers,
    });
  } catch (error) {
    return res.json(error.message);
  }
};

const getAllUsersNew = async (req, res) => {
  const { instituteId } = req.params;
  try {
    const allStudent = await DBMODELS.students.findAll({
      where: {
        role: "student",
        instituteId: instituteId,
      },
      attributes: [
        "id",
        "first_name",
        "last_name",
        "profile",
        [
          sequelize.literal(`(
          select is_account_verified
          from student_reg_details where students.id = student_reg_details.student_id
          ORDER BY student_reg_details.createDAt DESC
          LIMIT 1 
        )`),
          "status",
        ],
        [sequelize.literal(`'student'`), "role"],
      ],
      order: [["createdAt", "DESC"]],
    });
    const allTeacher = await DBMODELS.students.findAll({
      where: {
        role: "teacher",
        instituteId: instituteId,
      },
      attributes: [
        "id",
        "first_name",
        "last_name",
        "profile",
        [
          sequelize.literal(`(
          select is_account_verified
          from teacher_reg_details where students.id = teacher_reg_details.student_id 
          ORDER BY teacher_reg_details.createDAt DESC
          LIMIT 1 
        )`),
          "status",
        ],
        [sequelize.literal(`'teacher'`), "role"],
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json({
      message: "Succesfully fetched",
      allStudent,
      allTeacher,
    });
  } catch (error) {
    return res.json(error.message);
  }
};
const approveUser = async (req, res) => {
  const { studentId, instituteId, role } = req.params;

  try {
    role === "student"
      ? await DBMODELS.student_reg_details.update(
          {
            is_account_verified: true,
          },
          {
            where: {
              student_id: studentId,
            },
          }
        )
      : await DBMODELS.teacher_reg_details.update(
          {
            is_account_verified: true,
          },
          {
            where: {
              student_id: studentId,
            },
          }
        );
    const allUsers = await DBMODELS.students.findAll({
      where: {
        instituteId,
      },
      attributes: [
        "id",
        "first_name",
        "last_name",
        "role",
        "profile",
        [
          sequelize.literal(`(
         COALESCE(
          (
            SELECT is_account_verified
            FROM student_reg_details
            WHERE student_reg_details.student_id = students.id
        ) ,
         (
            SELECT is_account_verified
            FROM teacher_reg_details
            WHERE teacher_reg_details.student_id = students.id
        ),(SELECT true
          FROM student_onboard
          WHERE student_onboard.studentId = students.id)
         )
          )
      )`),
          "status",
        ],
      ],
    });

    return res.json({
      message: "Succesfully Approved",
      allUsers,
    });
  } catch (error) {
    return res.json(error.message);
  }
};
const approveUserNew = async (req, res) => {
  const { studentId, instituteId, role } = req.params;

  try {
    const instituteDetails = await DBMODELS.institutions.findOne({
      where: {
        id: instituteId,
      },
      attributes: ["first_name", "last_name"],
      raw: true,
    });
    if (role === "student") {
      const studentDetail = await DBMODELS.student_reg_details.findOne({
        where: {
          student_id: studentId,
        },
        raw: true,
      });
      if (!studentDetail) {
        return res.status(404).json({
          message: "User not found.",
        });
      }
      const [updatedCount] = await DBMODELS.student_reg_details.update(
        {
          is_account_verified: true,
        },
        {
          where: {
            student_id: studentId,
          },
        }
      );
      if (updatedCount > 0) {
        const replacements = {
          name: `${studentDetail?.first_name} ${studentDetail?.last_name}`,
          username: studentDetail?.email,
          approveBy: `${instituteDetails?.first_name} ${instituteDetails?.last_name}`,
        };
        let mailConfig = {
          email: studentDetail?.email,
          subject: `Your account is verified and active!`,
        };
        sendEmailService.sendTemplatedEmail(
          mailConfig,
          replacements,
          "Student_Activate"
        );
      } else {
        return res.json({
          message: "Server Error",
        });
      }
    } else {
      const teacherDetail = await DBMODELS.teacher_reg_details.findOne({
        where: {
          student_id: studentId,
        },
        raw: true,
      });
      if (!teacherDetail) {
        return res.status(404).json({
          message: "User not found.",
        });
      }
      const [updatedCount] = await DBMODELS.teacher_reg_details.update(
        {
          is_account_verified: true,
        },
        {
          where: {
            student_id: studentId,
          },
        }
      );
      if (updatedCount > 0) {
        const replacements = {
          name: `${teacherDetail?.first_name} ${teacherDetail?.last_name}`,
          username: teacherDetail?.email,
          approveBy: `${instituteDetails?.first_name} ${instituteDetails?.last_name}`,
        };

        let mailConfig = {
          email: teacherDetail?.email,
          subject: `Your account is verified and active!.`,
        };
        sendEmailService.sendTemplatedEmail(
          mailConfig,
          replacements,
          "Student_Activate"
        );
      } else {
        return res.json({
          message: "Server Error",
        });
      }
    }
    const allStudent = await DBMODELS.students.findAll({
      where: {
        role: "student",
        instituteId: instituteId,
      },
      attributes: [
        "id",
        "first_name",
        "last_name",
        "profile",
        [
          sequelize.literal(`(
          select is_account_verified
          from student_reg_details where students.id = student_reg_details.student_id
          ORDER BY student_reg_details.createDAt DESC
          LIMIT 1 
        )`),
          "status",
        ],
        [sequelize.literal(`'student'`), "role"],
      ],
    });
    const allTeacher = await DBMODELS.students.findAll({
      where: {
        role: "teacher",
        instituteId: instituteId,
      },
      attributes: [
        "id",
        "first_name",
        "last_name",
        "profile",
        [
          sequelize.literal(`(
          select is_account_verified
          from teacher_reg_details where students.id = teacher_reg_details.student_id 
          ORDER BY teacher_reg_details.createDAt DESC
          LIMIT 1 
        )`),
          "status",
        ],
        [sequelize.literal(`'teacher'`), "role"],
      ],
    });

    return res.json({
      message: "Succesfully Approved",
      allTeacher,
      allStudent,
    });
  } catch (error) {
    return res.json(error.message);
  }
};

const rejectUserNew = async (req, res) => {
  const { studentId, instituteId, role } = req.params;

  try {
    role === "student"
      ? await DBMODELS.student_reg_details.update(
          {
            is_account_verified: false,
          },
          {
            where: {
              student_id: studentId,
            },
          }
        )
      : await DBMODELS.teacher_reg_details.update(
          {
            is_account_verified: false,
          },
          {
            where: {
              student_id: studentId,
            },
          }
        );
    const allStudent = await DBMODELS.students.findAll({
      where: {
        role: "student",
        instituteId: instituteId,
      },
      attributes: [
        "id",
        "first_name",
        "last_name",
        "profile",
        [
          sequelize.literal(`(
          select is_account_verified
          from student_reg_details where students.id = student_reg_details.student_id
          ORDER BY student_reg_details.createDAt DESC
          LIMIT 1 
        )`),
          "status",
        ],
        [sequelize.literal(`'student'`), "role"],
      ],
    });
    const allTeacher = await DBMODELS.students.findAll({
      where: {
        role: "teacher",
        instituteId: instituteId,
      },
      attributes: [
        "id",
        "first_name",
        "last_name",
        "profile",
        [
          sequelize.literal(`(
          select is_account_verified
          from teacher_reg_details where students.id = teacher_reg_details.student_id 
          ORDER BY teacher_reg_details.createDAt DESC
          LIMIT 1 
        )`),
          "status",
        ],
        [sequelize.literal(`'teacher'`), "role"],
      ],
    });

    return res.json({
      message: "Succesfully Approved",
      allTeacher,
      allStudent,
    });
  } catch (error) {
    return res.json(error.message);
  }
};

const getInstituteCountStateWise = async (req, res) => {
  try {
    const institutes = await DBMODELS.institutions.findAll({
      attributes: ["state", [sequelize.fn("count", "id"), "count"]],
      group: ["state"],
      raw: true,
    });

    const stateNameMapping = {
      "andhra pradesh": "Andhra Pradesh",
      "arunachal pradesh": "Arunachal Pradesh",
      assam: "Assam",
      bihar: "Bihar",
      chhattisgarh: "Chhattisgarh",
      goa: "Goa",
      gujarat: "Gujarat",
      haryana: "Haryana",
      "himachal pradesh": "Himachal Pradesh",
      jharkhand: "Jharkhand",
      karnataka: "Karnataka",
      kerala: "Kerala",
      "madhya pradesh": "Madhya Pradesh",
      maharashtra: "Maharashtra",
      manipur: "Manipur",
      meghalaya: "Meghalaya",
      mizoram: "Mizoram",
      nagaland: "Nagaland",
      odisha: "Odisha",
      punjab: "Punjab",
      rajasthan: "Rajasthan",
      sikkim: "Sikkim",
      "tamil nadu": "Tamil Nadu",
      telangana: "Telangana",
      tripura: "Tripura",
      "uttar pradesh": "Uttar Pradesh",
      uttarakhand: "Uttarakhand",
      "west bengal": "West Bengal",
      "andaman and nicobar islands": "Andaman and Nicobar Islands",
      chandigarh: "Chandigarh",
      "dadra and nagar haveli and daman and diu":
        "Dadra and Nagar Haveli and Daman and Diu",
      delhi: "Delhi",
      lakshadweep: "Lakshadweep",
      puducherry: "Puducherry",
    };

    const data = institutes.map((institute) => [
      stateNameMapping[institute.state.toLowerCase()] || institute.state,
      institute.count,
    ]);

    // Adding the header row
    data.unshift(["State", "Registered Institutes"]);

    return res.json({
      message: "successfully get Institute data",
      result: data,
    });
  } catch (error) {
    return res.json({
      message: "Internal server Error",
      error: error.message,
    });
  }
};

// polls api

const getAllPollsQuestion = async (req, res) => {
  try {
    const allQuestionData = await DBMODELS.poll_questions.findAll();
    if (allQuestionData) {
      return res.json({
        message: "successfully fetched",
        result: allQuestionData,
      });
    }
  } catch (error) {
    return res.json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const selectedPollOption = async (req, res) => {
  try {
    const { questionId, studentId, vote } = req.body;
    const selectedOption = await DBMODELS.student_poll.create({
      studentId,
      poll_question_id: questionId,
      vote,
    });

    return res.json({
      message: "Data Post Successfully",
    });
  } catch (error) {
    return res.json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const checkUserAlreadyAttempt = async (req, res) => {
  const { studentId, questionId } = req.params;
  console.log(studentId);
  try {
    const userAlreadyAttempt = await DBMODELS.student_poll.findOne({
      where: {
        studentId,
        poll_question_id: questionId,
      },
    });

    if (userAlreadyAttempt) {
      return res.json({
        message: "successfully data get",
        result: true,
      });
    } else {
      return res.json({
        message: "successfully data get",
        result: false,
      });
    }
  } catch (err) {
    return res.json({
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};
const getVotesCount = async (req, res) => {
  const { questionId } = req.params;
  try {
    const getVotesQuestion = await DBMODELS.poll_questions.findOne({
      attributes: [
        "poll_ques",
        "options",
        [
          sequelize.literal(`(
          SELECT COUNT(poll_question_id)
          FROM yuvamanthan_test.student_poll 
          where poll_question_id = ${questionId}
          GROUP BY poll_question_id
          limit 1
        )`),
          "total_Count",
        ],
      ],
      where: {
        id: questionId,
      },
    });

    const getVotesCount = await DBMODELS.student_poll.findAll({
      where: {
        poll_question_id: questionId,
      },
      attributes: ["vote", [sequelize.fn("COUNT", "vote"), "TotalVotes"]],
      group: ["vote"],
    });

    return res.json({
      message: "data fetched successfully",
      getVotesQuestion,
      getVotesCount,
    });
  } catch (err) {
    return res.json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const getInstituteProfileData = async (req, res) => {
  const { id } = req.params;
  try {
    const instituteDetail = await DBMODELS.institutions.findOne({
      where: {
        id: id,
      },
      attributes: [
        "id",
        "institution_name",
        "institution_address",
        "bio",
        "logo",
        "title",
        "first_name",
        "middle_name",
        "last_name",
        "district",
        "state",
        "pincode",
        "email",
        "contact",
        "fb",
        "insta",
        "lkd",
        "twitter",
        "ytb",
      ],
    });
    return res.json({
      message: "successfully get data",
      result: instituteDetail,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

const getLatestPolls = async (req, res) => {
  try {
    const latestPools = await DBMODELS.blogs.findAll({
      limit: 4,
      order: [["createdAt", "DESC"]],
    });
    return res.json({
      success: true,
      message: "data fetched successfully",
      data: latestPools,
    });
  } catch (error) {
    return res.json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const addMessageToAdmin = async (req, res) => {
  const body = ({ email, message } = req.body);
  try {
    const message = await DBMODELS.institute_req_message.create(body);
    return res.status(200).json({
      message: "Succesfully message sent ",
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
const getSingleInstituteData = async (req, res) => {
  const { instituteId } = req.params;
  try {
    const result = await DBMODELS.institute_reg_details.findOne({
      where: {
        institute_id: instituteId,
      },
    });
    return res.json({
      message: "Data Found.",
      result,
    });
  } catch (error) {
    return res.json({
      message: "Data not found.",
    });
  }
};
const getAllUserParticularInst = async (req, res) => {
  const { instituteId } = req.params;
  try {
    const allUser = await DBMODELS.students.findAll({
      where: {
        instituteId,
      },
      attributes: [
        "id",
        [
          sequelize.literal(`(
          select concat(first_name,' ',last_name)
          from dual
         
        )`),
          "name",
        ],
        "email",
        [sequelize.col("contact"), "phone"],
        "role",
        "profile",
      ],
    });
    return res.json({
      message: "Success ",
      allUser,
    });
  } catch (error) {
    return res.json(error.message);
  }
};

//========= Add,delete,get and delete account manager after  institute registration ================ \\\
const postAccountManager = async (req, res) => {
  const {
    designation,
    email,
    instituteId,
    name,
    phone,
    studentId,
    typeOfManager,
  } = req.body;
  try {
    const instituteDetails = await DBMODELS.institute_reg_details.findOne({
      where: {
        institute_id: instituteId,
      },
    });
    const addData = await DBMODELS.institute_account_manager.create({
      designation,
      email,
      instituteId,
      name,
      phone,
      studentId,
      type_of_manager: typeOfManager,
    });
    //=========== Setup of  registration link for secretariat member =============\\
    const websiteUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000/"
    }`;
    const baseUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000/"
    }registration`;
    const params = {
      registration_type: "url",
      count: 4,
      type: addData?.designation,
      instituteId: addData?.instituteId,
      managerType: addData?.type_of_manager,
      sid: addData?.id,
      name: addData?.name,
      email: addData?.email,
      phone: addData?.phone,
    };
    ////============Link generate =============\\

    const encodedParams = Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    const finalUrl = `${baseUrl}?${encodedParams}`;
    ///============Email send service start here=======\\
    if (!addData?.studentId) {
      const registrationLink = finalUrl;
      const replacements = {
        name: `${addData?.name}`,
        institute_name: instituteDetails?.institution_name,
        assign_designation: addData?.type_of_manager,
        role: addData?.designation,
        pickedBy: `${instituteDetails?.first_name} ${instituteDetails?.last_name}`,
        registrationLink,
        websiteUrl,
      };
      let mailConfig = {
        email: addData?.email,
        subject: `You have been appointed as ${addData?.type_of_manager} on Yuvamanthan!.`,
      };
      sendEmailService.sendTemplatedEmail(
        mailConfig,
        replacements,
        "Institute_Acc_manager"
      );
    } else {
      console.log("Student id is not exist.");
    }
    return res.status(201).json({
      message: "data is added",
      addData,
    });
  } catch (error) {
    return res.json({
      message: "data is  not added",
      error: error?.message,
    });
  }
};
const getAccountManager = async (req, res) => {
  const { instituteId } = req?.params;
  try {
    const getAllManager = await DBMODELS.institute_account_manager.findAll({
      where: {
        instituteId,
      },
    });
    return res.status(200).json({
      message: "All Account manager find successfully.",
      getAllManager,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Manager not Found.",
      error: error?.message,
    });
  }
};
const deleteAccountManager = async (req, res) => {
  const { Id } = req.params;
  try {
    const managerDetails = await DBMODELS.institute_account_manager.findOne({
      where: {
        id: Id,
      },
    });
    if (!managerDetails) {
      return res.status(404).json({
        message: "Id Does not exist.",
      });
    }
    await DBMODELS.institute_account_manager.destroy({
      where: {
        id: Id,
      },
    });
    return res.status(200).json({
      message: "Record Deleted Successfully.",
    });
  } catch (error) {
    return res.status(200).json({
      message: error?.message,
    });
  }
};
const editAccountManager = async (req, res) => {
  const { id } = req.params;
  const {
    designation,
    email,
    instituteId,
    name,
    phone,
    studentId,
    typeOfManager,
  } = req.body;
  try {
    const updateData = await DBMODELS.institute_account_manager.update(
      {
        designation,
        email,
        instituteId,
        name,
        phone,
        studentId,
        type_of_manager: typeOfManager,
      },
      {
        where: {
          id,
        },
      }
    );
    if (updateData) {
      return res.status(200).json({
        message: "Record Updated.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error?.message,
    });
  }
};
// get all country data
const fetchCountryData = async (req, res) => {
  try {
    let allCountryData = [];
    for (let i = 0; i < countryData?.length; i++) {
      allCountryData.push({
        name: countryData[i]?.name,
        value: countryData[i]?.name,
      });
    }
    if (allCountryData) {
      return res.status(200).json({ msg: "Country found", allCountryData });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error", error: error.message });
  }
};

// get all state of each country
const fetchStateData = async (req, res) => {
  try {
    const countryName = req?.params;
    const country = countryData.find((c) => c.name === countryName?.country);
    const states = country?.states?.map((i) => {
      return {
        name: i?.name,
        value: i?.name,
      };
    });
    if (states.length > 0) {
      return res.status(200).json({
        result: states,
      });
    } else {
      return res.status(404).json({ msg: "State not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error", error: error.message });
  }
};

const getAllinstituteData = async (req, res) => {
  try {
    const getInstituteData = await DBMODELS.institutions.findAll({
      attributes: [
        "id",
        "institution_name",
        "institution_address",
        "bio",
        "logo",
        "title",
        "first_name",
        "middle_name",
        "last_name",
        "district",
        "state",
        "pincode",
        "email",
        "contact",
        "status",
      ],
    });
    if (getInstituteData) {
      return res
        .status(200)
        .json({ msg: "Successfully get data", getInstituteData });
    } else {
      return res.status(404).json({ msg: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};

const fetchInstituteDetails = async (req, res) => {
  const { instituteId } = req.params;
  try {
    const institute = await DBMODELS.institutions.findOne({
      where: {
        id: instituteId,
      },
      raw: true,
      attributes: [
        "id",
        "contact",
        "logo",
        "district",
        "state",
        "pincode",
        "institution_address",
        "state",
        "institution_name",
        [
          sequelize.literal(`(
        SELECT CONCAT(first_name, ' ' , last_name) 
        from institutions
        where institutions.id = ${instituteId}
      )`),
          "name",
        ],
      ],
    });
    if (institute) {
      return res.json({ result: institute });
    } else {
      return res.json({ result: null });
    }
  } catch (error) {
    return res.json({ message: error.message });
  }
};

const isNipamInstitute = async (req, res) => {
  const { email } = req.params;
  try {
    const isNipamInstitute = await DBMODELS.nipam_institute.findOne({
      where: { email },
    });

    if (isNipamInstitute) {
      return res.json({ result: true });
    } else {
      return res.json({ result: false });
    }
  } catch (error) {
    return res.json({ message: "Internal server Error", error: error.message });
  }
};

// start of excel sheet api
const passwordToUpdate = [];
async function validate(data, instituteId, role) {
  var emails = [];
  var dataSaved = [];
  var dataFailed = [];
  try {
    // const instituteEmail = await DBMODELS.institutions.findAll({
    //   attributes: ["email"],
    //   raw: true,
    // });
    // const studentEmails = await DBMODELS.students.findAll({
    //   attributes: ["email"],
    //   raw: true,
    // });
    // const coordinaterEmail = await DBMODELS.institute_coordinators.findAll({
    //   attributes: ["email"],
    //   raw: true,
    // });
    // instituteEmail.forEach(({ email }) => {
    //   emails = [...emails, email];
    // });
    // studentEmails.forEach(({ email }) => {
    //   emails = [...emails, email];
    // });
    // coordinaterEmail.forEach(({ email }) => {
    //   emails = [...emails, email];
    // });
    if (data) {
      data.map(async ({ First_name, Last_name, Contact, Email, DOB }) => {
        if (First_name && Contact && Email) {
          if (emails.includes(Email)) {
            dataFailed = [
              ...dataFailed,
              { First_name, Last_name, Contact, Email, Error: "User Exists " },
            ];
          } else {
            dataSaved = [
              ...dataSaved,
              {
                first_name: First_name,
                last_name: Last_name ?? "",
                contact: Contact,
                email: Email,
                // dob: moment(DOB, "DD-MM-YYYY").isValid()
                //   ? moment(DOB, "DD-MM-YYYY").format("YYYY-MM-DD")
                //   : "",
                // status: "active",
                // password: "@Yuva" + uid(4),
                institute_Id: instituteId,
                role,
              },
            ];
          }
        } else {
          dataFailed = [
            ...dataFailed,
            {
              First_name,
              Last_name,
              Contact,
              Email,
              Error: "User Data Missing",
            },
          ];
        }
      });
      return { dataSaved, dataFailed };
    }
  } catch (err) {
    logg.error(err);
  }
}

setInterval(() => {
  if (passwordToUpdate.length) {
    pass = passwordToUpdate.pop();
    uploadPassword(pass);
  }
}, 20);

async function uploadPassword(student) {
  try {
    DBMODELS.students.update(
      {
        password: await hashingPassword(student.password),
      },
      {
        where: { id: student.id },
      }
    );
  } catch (error) {
    logg.error(error);
  }
}
// adding CSV data into the database by institute
// const addMultipleTeacStud = async (req, res) => {
//   const instituteId = req.user.id;
//   const { role } = req.body;
//   const data = req.json;
//   if (data?.length <= 2000 && data.length > 0) {
//     await validate(data, instituteId, role)
//       .then(async ({ dataSaved, dataFailed }) => {
//         if (dataSaved || dataFailed) {
//           try {
//             const result = await DBMODELS.all_teacher_student.bulkCreate(dataSaved, {
//               fields: [
//                 "first_name",
//                 "last_name",
//                 "email",
//                 "contact",
//                 "institute_Id",
//                 "role",
//               ],
//               validate: true,
//             });
//             res.status(200).json({
//               message: "Data Uploaded Successfuly.",
//               dataSaved: result,
//               dataFailed,
//             });
//             // try {
//             //   let temp = Array.from(result);
//             //   passwordToUpdate.push(...temp);
//             //   emailProcessing(result, "STUDENT"); //Email to student.
//             //   // emailWelcomeInstitute(result);
//             //   // emailLoginCredentials(result);
//             // } catch (err) {
//             //   logg.error(err);
//             // }
//           } catch (err) {
//             logg.error(err);
//             res
//               .status(404)
//               .json({ message: "Data Uploaded Failed!!", err, dataFailed });
//           }
//         }
//       })
//       .catch((err) => {
//         logg.error(err);
//         res.status(201).json({ message: "Data Uploaded Failed!!" });
//       });
//   } else if (data.length === 0) {
//     res.status(201).json({ message: "No Data Found " });
//   } else if (data.length > 2000) {
//     res.status(201).json({ message: "Exceed Data Limit !!!" });
//   } else {
//     res.status(500).json({ message: "Internal Server Error!!" });
//   }
// };

// get api for showing the CSV correct and incorrect data
const getMultipleTeachStud = async (req, res) => {
  const { instituteId, role } = req.params;
  try {
    const correctData = await DBMODELS.all_teacher_student.findAll({
      where: {
        role: role,
        instituteId: instituteId,
        correctness: "correct",
      },
    });
    const incorrectData = await DBMODELS.all_teacher_student.findAll({
      where: {
        role: role,
        instituteId: instituteId,
        correctness: "incorrect",
      },
    });
    const getAllTeachStud = [correctData, incorrectData];
    return res
      .status(200)
      .json({ msg: "Successfully get data", getAllTeachStud });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// for updating the incorrect data from the spreadsheet (CSV)
const updateStudentDetails = async (req, res) => {
  const { instituteId } = req.params;
  const { updatedData } = req.body;
  try {
    const userId = updatedData.id;
    const updateProfile = await DBMODELS.all_teacher_student.update(
      { ...updatedData, correctness: "correct" },
      {
        where: {
          id: userId,
          instituteId: instituteId,
        },
      }
    );
    if (updateProfile[0] > 0) {
      return res.status(200).json({ msg: "Update successful!" });
    } else {
      return res.status(404).json({ msg: "Record not found!" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

//api to update the attendance of student and teacher
async function updateStudentAttendance(req, res) {
  const { instituteId } = req.params;
  const { presentStudents } = req.body;
  try {
    if (!Array.isArray(presentStudents) || presentStudents.length === 0) {
      return res.status(400).json({
        message: "No student IDs provided.",
        error: "Empty presentStudents array",
      });
    }

    const updatedUsers = await DBMODELS.all_teacher_student.update(
      { isPresent: 1 },
      {
        where: {
          id: presentStudents,
          instituteId,
        },
      }
    );

    if (updatedUsers[0] > 0) {
      res.status(200).json({
        message: "Students' presence updated successfully.",
        updatedCount: updatedUsers[0],
      });
    } else {
      res.status(404).json({
        message: "No Updates Made.",
        error: "No students found for the provided IDs and instituteId",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
}

// end of excel sheet api
const getInstituteName = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const getInstituttionName = await DBMODELS.institutions.findOne({
      where: {
        id: instituteId,
      },
      attributes: ["institution_name"],
    });

    if (getInstituttionName) {
      return res
        .status(200)
        .json({ msg: "Get successfully", getInstituttionName });
    } else {
      return res.status(404).json({ msg: "Not found name" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const getStudentProfile = async (req, res) => {
  const { role, studentId } = req.params;

  try {
    if (role === "student") {
      const getStudentPreFerence = await DBMODELS.student_reg_details.findOne({
        where: {
          student_id: studentId,
        },
        attributes: ["interests", "activities", "experience", "achievements"],
      });
      if (getStudentPreFerence) {
        return res
          .status(200)
          .json({ msg: "Get srudnet profile", getStudentPreFerence });
      } else {
        return res.status(404).json({ msg: "Profile not found" });
      }
    } else if (role === "teacher") {
      const getStudentPreFerence = await DBMODELS.teacher_reg_details.findOne({
        where: {
          student_id: studentId,
        },
        attributes: ["interests", "activities", "experience", "achievements"],
      });
      if (getStudentPreFerence) {
        return res
          .status(200)
          .json({ msg: "Get srudnet profile", getStudentPreFerence });
      } else {
        return res.status(404).json({ msg: "Profile not found" });
      }
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const updateStudentProfile = async (req, res) => {
  const { role, studentId } = req.params;
  const body = req.body;
  try {
    if (role === "student") {
      const updateProfile = await DBMODELS.student_reg_details.update(body, {
        where: {
          student_id: studentId,
        },
      });
      if (updateProfile) {
        return res
          .status(200)
          .json({ msg: "Update successfully", updateProfile });
      } else {
        return res.status(404).json({ msg: "Not found" });
      }
    } else if (role === "teacher") {
      const updateProfile = await DBMODELS.teacher_reg_details.update(body, {
        where: {
          student_id: studentId,
        },
      });
      if (updateProfile) {
        return res
          .status(200)
          .json({ msg: "Update successfully", updateProfile });
      } else {
        return res.status(404).json({ msg: "Not found" });
      }
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = {
  isNipamInstitute,
  fetchInstituteDetails,
  getAllPollsQuestion,
  getInstituteCountStateWise,
  rejectUserNew,
  getAllUsersNew,
  approveUserNew,
  approveUser,
  getAllUsers,
  getInstituteManager,
  getAllInstitute,
  fetchStudentDetails,
  deleteStudentDetails,
  checkOnBoardStatus,
  selectedPollOption,
  checkUserAlreadyAttempt,
  getVotesCount,
  getInstituteProfileData,
  getLatestPolls,
  addMessageToAdmin,
  getSingleInstituteData,
  getAllUserParticularInst,
  postAccountManager,
  getAccountManager,
  deleteAccountManager,
  editAccountManager,
  fetchCountryData,
  fetchStateData,
  getAllinstituteData,
  getMultipleTeachStud,
  // addMultipleTeacStud,
  getInstituteName,
  getStudentProfile,
  updateStudentProfile,
  updateStudentDetails,
  updateStudentAttendance,
};
