const { DBMODELS } = require("../../database/models/init-models");
const { Sequelize, Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sendMail = require("../email/sendMail");

const upload = multer({ dest: "uploads/" });

const addQuestion = async (req, res) => {
  try {
    const body = req.body;
    const question = await DBMODELS.riasecQuestions.create(body);
    if (question) {
      return res.json({
        message: "successfully created qusetion",
      });
    } else {
      return res.json({
        message: "not created",
      });
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

// const addToCareerList = async (req, res) => {
//     // console.log(req.file);
// try {
//         // if (!req.file) {
//         //     return res.status(400).json({ message: 'No file uploaded' });
//         // }

//         // const excelFilePath = path.join(__dirname, 'RaisecCareerList.xlsx');

//         // const workbook = XLSX.readFile(excelFilePath);
//         // const sheetName = workbook.SheetNames[0];
//         // const sheet = workbook.Sheets[sheetName];

//         // const data = jsonData;
//         // console.log(data[0]);

//         // const report = await DBMODELS.riasecCareerList.bulkCreate(data);
// const dataPath = path.join(__dirname, 'lsmtData.json'); // adjust path as necessary
// const dataPath = path.join(__dirname, 'data.json'); // adjust path as necessary
// const fileData = fs.readFileSync(dataPath, 'utf8');
// console.log("File Data: ", fileData);
// const data = JSON.parse(fileData);
// console.log("Data: ", data);

// for (let career of data) {
// if(career.careerName == null){
//     console.log(career.careerId, '\n', career.careerName, '\n', career.careerDetails);
// }
// await DBMODELS.lsmtQuestions.create({
//   text: career.question,
//   type: career.type,
//   option: career.option,
//   createdAt: new Date(), // convert to Date object if necessary
//   updatedAt: new Date()  // convert to Date object if necessary
// });
//     await DBMODELS.riasecCareer.create({
//         R: career.R,
//         A: career.A,
//         I: career.I,
//         S: career.S,
//         E: career.E,
//         C: career.C,
//         Career1: career.Career1,
//         Career2: career.Career2,
//         Career3: career.Career3,
//         Career4: career.Career4,
//         Career5: career.Career5,
//         Career6: career.Career6,
//         Career7: career.Career7,
//         Career8: career.Career8,
//         createdAt: new Date(), // convert to Date object if necessary
//         updatedAt: new Date()  // convert to Date object if necessary
//       });
//   }

// if (report && report.length > 0) {
//     return res.json({
//         message: 'Successfully added careers to the list',
//     });
// } else {
//     return res.json({
//         message: 'No data was added',
//     });
// }
// } catch (error) {
//     console.error('Error while adding to career list:', error);
//     return res.json({
//         error: error.message,
//     });
// }
// };

// module.exports = {
//     addToCareerList: [
//         upload.single('excelFile'),
//         addToCareerList,
//     ],
// };

const getAllQuestion = async (req, res) => {
  try {
    const allQuestion = await DBMODELS.riasecQuestions.findAll({
      order: [["order", "ASC"]],
      raw: true,
    });
console.log("all risec question fetched from database",allQuestion)
    if (allQuestion) {
      return res.json({
        message: "successfully get all question",
        result: allQuestion,
      });
    } else {
      return res.json({
        message: "no data found",
        result: allQuestion,
      });
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

const editQuestion = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const update = await DBMODELS.riasecQuestions.update(body, {
      where: {
        id,
      },
    });
    if (update) {
      return res.json({
        message: "updated successfully",
      });
    }
    return res.json({
      message: "internal server error",
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

const scoreConversion = (value) => {
  if (value >= 0 && value <= 2) {
    return "low";
  } else if (value >= 3 && value <= 5) {
    return "medium";
  } else {
    return "high";
  }
};
const careerBasedOnScore = async (req, res) => {
  const { userId } = req.params;
  try {
    const attemptData = await DBMODELS.riasecAttempt.findOne({
      where: {
        userId: userId,
        // role : 'student'
      },
    });
    // console.log(attemptData);
    const { r, a, i, s, e, c } = attemptData.result;
    // console.log(r,a,i,s,e,c);
    const R_Score = scoreConversion(r);
    const A_Score = scoreConversion(a);
    const I_Score = scoreConversion(i);
    const S_Score = scoreConversion(s);
    const E_Score = scoreConversion(e);
    const C_Score = scoreConversion(c);

    const careerData = await DBMODELS.riasecCareer.findOne({
      where: {
        R: R_Score,
        A: A_Score,
        I: I_Score,
        S: S_Score,
        E: E_Score,
        C: C_Score,
      },
    });

    const career1Id = careerData.Career1;
    const career2Id = careerData.Career2;
    const career3Id = careerData.Career3;
    const career4Id = careerData.Career4;
    const career5Id = careerData.Career5;
    const career6Id = careerData.Career6;
    const career7Id = careerData.Career7;
    const career8Id = careerData.Career8;

    const allCareers = await DBMODELS.riasecCareerList.findAll({
      where: {
        careerId: {
          [Op.in]: [
            career1Id,
            career2Id,
            career3Id,
            career4Id,
            career5Id,
            career6Id,
            career7Id,
            career8Id,
          ],
        },
      },
    });
    // console.log(allCareers);

    if (allCareers) {
      return res.json({
        message: "Required Data Found Successfully!!",
        result: allCareers,
      });
    } else {
      return res.json({
        message: "No Such Data Found!!",
      });
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await DBMODELS.riasecQuestions.destroy({
      where: {
        id,
      },
    });
    return res.json({ message: "delete success" });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

const getQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await DBMODELS.riasecQuestions.findOne({
      where: {
        order: [["createdAt", "DESC"]],
        id,
      },
    });
    return res.json({ message: "get success", result: question });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

const getAttempt = async (req, res) => {
  const { userId, role } = req.params;
  try {
    const attempt = await DBMODELS.riasecAttempt.findOne({
      where: {
        userId,
        role,
      },
    });
    return res.json({
      message: "get successfully",
      result: attempt,
    });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

const postAttempt = async (req, res) => {
  const body = req.body;
  try {
    const attemptExist = await DBMODELS.riasecAttempt.findOne({
      where: {
        userId: body.userId,
      },
    });
    if (attemptExist) {
      const attempt = await DBMODELS.riasecAttempt.update(body, {
        where: {
          userId: body.userId,
        },
      });
      return res.json({
        message: "Attempt Updated Successfully!!",
        result: attempt,
      });
    } else {
      // can use the 'upsert' also for 'create' or 'update' feature
      const attempt = await DBMODELS.riasecAttempt.create(body);
      return res.json({
        message: "Attempt Saved Successfully!!",
        result: attempt,
      });
    }
  } catch (error) {
    return res.json({ message: error.message });
  }
};

// const studentBasedOnClass = async (req, res) => {
//   const { instituteId, Class } = req.body;
//   if (!instituteId || !Class) {
//     return res.status(404).json({ message: "Some Details are Missing!!" });
//   }
//   try {
//     const studentList = await DBMODELS.students.findAll({
//       where: {
//         instituteId: instituteId,
//         class: Class,
//       },
//     });
//     if (studentList) {
//       return res.status(200).json({
//         message: "Student List Fetched Successfully!!",
//         result: studentList,
//       });
//     } else {
//       return res
//         .status(404)
//         .json({ message: "No Such Student Details Found!!" });
//     }
//   } catch (error) {
//     return res.json({ message: error.message });
//   }
// };

const testAttendees = async (req, res) => {
  const { instituteId, Class } = req.body;
  if (!instituteId || !Class) {
    return res.status(404).json({ message: "Some Details are Missing!!" });
  }

  try {
    const studentsWithAttempts = await DBMODELS.students.findAll({
      where: {
        instituteId: instituteId,
        class: Class,
      },
      attributes: [
        "id",
        "first_name",
        "last_name",
        "father_name",
        "email",
        "contact",
        "class",
        [Sequelize.col("riasecAttempts.result"), "result"], // Fetch the result from riasecAttempt table
      ],
      include: [
        {
          model: DBMODELS.riasecAttempt,
          as: "riasecAttempts",
          attributes: ["result"], // Fetch only the result
          where: {
            role: "student", // Assuming role must be 'student'
          },
          required: false, // Left join to include students without attempts
        },
      ],
    });

    if (studentsWithAttempts.length > 0) {
      return res.status(200).json({
        message: "Student List Based on Attempt Fetched Successfully!!",
        result: studentsWithAttempts.map((student) => ({
          id: student.id,
          first_name: student.first_name,
          last_name: student.last_name,
          father_name: student.father_name,
          email: student.email,
          contact: student.contact,
          class: student.class,
          result: student.dataValues.result || null, // If result is null, return null explicitly
        })),
      });
    } else {
      return res.status(404).json({
        message: "No students found or no attempts made!",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const parentEmailResult = async (req, res) => {
  try {
    const userId = req.params.studentId;

    const student = await DBMODELS.students.findOne({
      where: { id: userId },
      attributes: ["parentEmail"],
    });

    if (!student || !student.parentEmail) {
      console.warn("Parent email not found for the student.");
      return res.status(404).json({ message: "Parent email not found" });
    }

    const parentEmail = student.parentEmail;
    const subject = "Important Update: Notifications for Parents";
    const body = `<html>
                        <body>
                            <h1>Dear Parent,</h1>
                            <p>Your child has an important update regarding their school program.</p>
                            <p>Please check the latest notifications on the school portal.</p>
                            <p>Best regards,<br>Your School Team</p>
                        </body>
                    </html>`;

    const result = await sendMail(parentEmail, subject, body);

    if (result.success) {
      console.log(`Successfully sent email to ${parentEmail}.`);

      // Here we need to update the riasecAttempt table's emailSent field to true

      // await DBMODELS.students.update(
      //     { mailsent: true },
      //     { where: { id: req.params.studentId } }
      // );

      return res.status(200).json({ message: "Email sent successfully" });
    } else {
      console.error(`Failed to send email to ${parentEmail}: ${result.error}`);
      return res
        .status(500)
        .json({ message: "Failed to send email", error: result.error });
    }
  } catch (error) {
    console.error(`Error during email processing: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Error sending email", error: error.message });
  }
};

const teacherFeedbackFunction = async (teacherId, studentId, feedback) => {
  if (!teacherId || !studentId) {
    return {
      message_id: 1,
      message: "Some Details are Missing!!",
    };
  }

  const temp_teacherId = teacherId;
  const temp_studentId = studentId;
  const newFeedback = feedback;

  try {
    const studentData = await DBMODELS.riasecFeedback.findOne({
      where: {
        studentId: temp_studentId,
      },
    });

    if (studentData) {
      // Update Query
      let existingFeedback = studentData.teacherFeedback;
      const string_teacherId = temp_teacherId.toString();

      if (!existingFeedback[string_teacherId]) {
        existingFeedback[string_teacherId] = [];
      }

      existingFeedback[string_teacherId].push(newFeedback);

      await DBMODELS.riasecFeedback.update(
        { teacherFeedback: existingFeedback },
        {
          where: { studentId: temp_studentId },
        }
      );
      return {
        message_id: 2,
        message:
          "Teacher Feedback inserted into the Student List Successfully!!",
      };
    } else {
      // Create Query
      const feedbackData = {
        [teacherId]: [feedback], // Use dynamic key for the teacher
      };
      const newFeedbackEntry = await DBMODELS.riasecFeedback.create({
        studentId: temp_studentId,
        teacherFeedback: feedbackData,
      });
      if (newFeedbackEntry) {
        return {
          message_id: 3,
          message: "New Student Feedback Entry Created!!",
        };
      } else {
        return {
          message_id: 4,
          message: "New Student Feedback Entry Failed!!",
        };
      }
    }
  } catch (error) {
    return {
      message_id: 5,
      message: error.message,
    };
  }
};

const instituteFeedbackFunction = async (instituteId, studentId, feedback) => {
  if (!instituteId || !studentId) {
    return {
      message_id: 1,
      message: "Some Details are Missing!!",
    };
  }
  const temp_instituteId = instituteId;
  const temp_studentId = studentId;
  const newFeedback = feedback;

  try {
    const studentData = await DBMODELS.riasecFeedback.findOne({
      where: {
        studentId: temp_studentId,
      },
    });
    if (studentData) {
      // Update query
      let existingFeedback = studentData.instituteFeedback;
      const string_instituteId = temp_instituteId.toString();

      if (!existingFeedback[string_instituteId]) {
        existingFeedback[string_instituteId] = [];
      }

      existingFeedback[string_instituteId].push(newFeedback);

      await DBMODELS.riasecFeedback.update(
        { instituteFeedback: existingFeedback },
        {
          where: { studentId: temp_studentId },
        }
      );

      return {
        message_id: 2,
        message:
          "Institute Feedback inserted into the Student List Successfully!!",
      };
    } else {
      // Create Query
      const feedbackData = {
        [instituteId]: [feedback], // Using dynamic key for the institute
      };
      const newFeedbackEntry = await DBMODELS.riasecFeedback.create({
        studentId: temp_studentId,
        instituteFeedback: feedbackData,
      });
      if (newFeedbackEntry) {
        return {
          message_id: 3,
          message: "New Student Feedback Entry Created!!",
        };
      } else {
        return {
          message_id: 4,
          message: "New Student Feedback Entry Failed!!",
        };
      }
    }
  } catch (error) {
    return {
      message_id: 5,
      message: error.message,
    };
  }
};

const handleFeedback = async (req, res) => {
  const { userId, studentId, role, feedback } = req.body;
  if (!userId || !studentId || !role || !feedback) {
    return res.status(404).json({
      message: "Some Details are Missing!!",
    });
  }
  try {
    if (role === "teacher") {
      const result = teacherFeedbackFunction(userId, studentId, feedback);
      if ((await result).message_id === 2 || (await result).message_id === 3) {
        return res.status(200).json({
          message: "Data saved successfully!!",
        });
      } else {
        return res.status(500).json({
          message: "Something went wrong!!",
        });
      }
    } else if (role === "institute") {
      const result = instituteFeedbackFunction(userId, studentId, feedback);
      if ((await result).message_id === 2 || (await result).message_id === 3) {
        return res.status(200).json({
          message: "Data saved successfully!!",
        });
      } else {
        return res.status(500).json({
          message: "Something went wrong!!",
        });
      }
    } else {
      return res.status(404).json({
        message: "No Such User Type Found!!",
      });
    }
  } catch (error) {
    return res.json({ message: error.message });
  }
};

const getFeedbackData = async (req, res) => {
  const { studentId } = req.params;
  if (!studentId) {
    return res
      .status(400)
      .json({ message: "Invalid input: studentId is required" });
  }
  try {
    const studentFeedbackData = await DBMODELS.riasecFeedback.findOne({
      where: {
        studentId,
      },
      attributes: ["teacherFeedback", "instituteFeedback"],
    });
    return res.status(200).json({
      message: "Student Feedback Data Fetched Successfully!!",
      result: studentFeedbackData,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const assignCareerGuide = async (req, res) => {
  const { instituteId, mentorData } = req.body;

  if (!instituteId || !Array.isArray(mentorData)) {
    return res.status(400).json({
      message: "Invalid input: instituteId and mentorData array are required",
    });
  }

  try {
    for (const mentor of mentorData) {
      const { teacherId, riasec, lsmt } = mentor;

      if (!teacherId || !Array.isArray(riasec) || !Array.isArray(lsmt)) {
        return res.status(400).json({
          message:
            "Invalid mentor data: teacherId, riasec, and lsmt are required",
        });
      }

      const existingGuide = await DBMODELS.careerGuide.findOne({
        where: {
          teacherId,
          instituteId,
        },
      });

      if (existingGuide) {
        // Update query
        const currentAssignments = existingGuide.isAssigned || [];
        currentAssignments.push({ riasec, lsmt });

        await DBMODELS.careerGuide.update(
          { isAssigned: currentAssignments },
          {
            where: {
              teacherId: teacherId,
              instituteId: instituteId,
            },
          }
        );
      } else {
        // Create query
        await DBMODELS.careerGuide.create({
          teacherId,
          instituteId,
          isAssigned: [{ riasec, lsmt }],
        });
      }
    }
    console.log("Career guides assigned successfully.");
    return res
      .status(200)
      .json({ message: "Career guides assigned successfully" });
  } catch (error) {
    console.error("Error assigning career guides:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUnassignedCareerGuides = async (req, res) => {
  const { instituteId } = req.params;

  if (!instituteId) {
    return res
      .status(400)
      .json({ message: "Invalid input: instituteId is required" });
  }

  try {
    const careerGuideTeacherIds = await DBMODELS.careerGuide.findAll({
      where: {
        instituteId: instituteId,
      },
      attributes: ["teacherId"],
    });

    const teacherIdsInCareerGuide = careerGuideTeacherIds.map(
      (record) => record.teacherId
    );

    const availableTeachers = await DBMODELS.students.findAll({
      where: {
        instituteId: instituteId,
        role: "teacher",
        id: {
          [Op.notIn]: teacherIdsInCareerGuide,
        },
      },
      attributes: ["id", "first_name", "middle_name", "last_name"],
    });

    return res.status(200).json({
      message: "Assigned Career Guides Fetched Successfully!",
      result: availableTeachers,
    });
  } catch (error) {
    console.error("Error fetching available teachers:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllAssignedCareerGuides = async (req, res) => {
  const { instituteId } = req.params;

  if (!instituteId) {
    return res
      .status(400)
      .json({ message: "Invalid input: instituteId is required" });
  }

  try {
    const assignedGuides = await DBMODELS.careerGuide.findAll({
      where: {
        instituteId,
      },
      attributes: ["teacherId", "isAssigned"],
    });

    if (!assignedGuides || assignedGuides.length === 0) {
      return res.status(404).json({
        message: "No assigned career guides found for this institute",
      });
    }

    const teacherIds = assignedGuides.map((guide) => guide.teacherId);

    const teachers = await DBMODELS.students.findAll({
      where: {
        id: teacherIds,
        role: "teacher",
      },
      attributes: ["id", "first_name", "middle_name", "last_name"],
    });

    const result = assignedGuides.map((guide) => {
      const teacher = teachers.find((t) => t.id === guide.teacherId);
      return {
        id: guide.teacherId,
        isAssigned: guide.isAssigned,
        first_name: teacher ? teacher.first_name : "",
        middle_name: teacher ? teacher.middle_name : "",
        last_name: teacher ? teacher.last_name : "",
      };
    });

    return res.status(200).json({
      message: "Assigned Career Guides Fetched Successfully!",
      result,
    });
  } catch (error) {
    console.error("Error fetching assigned teachers:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCareerGuideData = async (req, res) => {
  const { teacherId } = req.params;
  if (!teacherId) {
    return res
      .status(400)
      .json({ message: "Invalid input: teacherId is required" });
  }
  try {
    const guideData = await DBMODELS.careerGuide.findOne({
      where: {
        teacherId,
      },
    });
    return res.status(200).json({
      message: "Guide Data Fetched Successfully!!",
      result: guideData,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCareerGuide = async (req, res) => {
  const { instituteId, mentorData } = req.body;

  // Validate input
  if (!instituteId || !Array.isArray(mentorData)) {
    return res.status(400).json({
      message: "Invalid input: instituteId and mentorData array are required",
    });
  }

  try {
    for (const mentor of mentorData) {
      const { teacherId, riasec, lsmt } = mentor;

      // Validate mentor data
      if (!teacherId || !Array.isArray(riasec) || !Array.isArray(lsmt)) {
        return res.status(400).json({
          message:
            "Invalid mentor data: teacherId, riasec, and lsmt are required",
        });
      }

      // Find existing guide
      const existingGuide = await DBMODELS.careerGuide.findOne({
        where: {
          teacherId,
          instituteId,
        },
      });

      if (existingGuide) {
        // Check if both riasec and lsmt are empty arrays
        if (riasec.length === 0 && lsmt.length === 0) {
          // Remove the guide's details
          await DBMODELS.careerGuide.destroy({
            where: {
              teacherId,
              instituteId,
            },
          });
        } else {
          // Update the existing guide
          const currentAssignments = existingGuide.isAssigned || [];
          // Assuming we want to replace the old entries with the new ones
          const updatedAssignments = currentAssignments.map((assignment) => {
            return {
              riasec: riasec.length > 0 ? riasec : assignment.riasec,
              lsmt: lsmt.length > 0 ? lsmt : assignment.lsmt,
            };
          });

          await DBMODELS.careerGuide.update(
            { isAssigned: updatedAssignments },
            {
              where: {
                teacherId: teacherId,
                instituteId: instituteId,
              },
            }
          );
        }
      } else {
        // Handle the case where the guide does not exist, if necessary
        return res.status(404).json({
          message:
            "Career guide not found for the given teacherId and instituteId",
        });
      }
    }

    console.log("Career guides updated successfully.");
    return res
      .status(200)
      .json({ message: "Career guides updated successfully" });
  } catch (error) {
    console.error("Error updating career guides:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  postAttempt,
  getAttempt,
  getQuestionById,
  deleteQuestion,
  addQuestion,
  getAllQuestion,
  editQuestion,
  parentEmailResult,
  careerBasedOnScore,
  // studentBasedOnClass,
  testAttendees,
  handleFeedback,
  getFeedbackData,
  assignCareerGuide,
  getAllUnassignedCareerGuides,
  getAllAssignedCareerGuides,
  getCareerGuideData,
  updateCareerGuide,
  // addToCareerList
};
