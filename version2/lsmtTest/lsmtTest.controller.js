const { DBMODELS } = require("../../database/models/init-models");
const { Sequelize, Op } = require("sequelize");

const getAllQuestion = async (req, res) => {
  try {
    const allQuestion = await DBMODELS.lsmtQuestions.findAll({
      raw: true,
    });

    if (allQuestion) {
      return res.json({
        message: "Fetched All The Questions Successfully!!",
        result: allQuestion,
      });
    } else {
      return res.json({
        message: "No Questions Found!!",
      });
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

const getAttempt = async (req, res) => {
  const { userId, role } = req.params;
  try {
    const fetchAttempt = await DBMODELS.lsmtAttempt.findOne({
      where: {
        userId: userId,
        role: role,
      },
    });
    if (fetchAttempt) {
      return res.json({
        message: "Attempt Fetched Successfully!!",
        result: fetchAttempt,
      });
    } else {
      return res.json({ message: "Failed to Fetch the Attempt!!" });
    }
  } catch (error) {
    return res.json({ message: error.message });
  }
};

const postAttempt = async (req, res) => {
  const body = req.body;
  try {
    const attemptExist = await DBMODELS.lsmtAttempt.findOne({
      where: {
        userId: body.userId,
      },
    });
    if (attemptExist) {
      const attempt = await DBMODELS.lsmtAttempt.update(body, {
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
      const attempt = await DBMODELS.lsmtAttempt.create(body);
      return res.json({
        message: "Attempt Saved Successfully!!",
        result: attempt,
      });
    }
  } catch (error) {
    return res.json({ message: error.message });
  }
};

// student_id, teacher_id and comment
const lsmtResult = async (req, res) => {
  const { userId } = req.params;
  try {
    const fetchAttempt = await DBMODELS.lsmtAttempt.findOne({
      where: {
        userId: userId,
      },
    });
    if (fetchAttempt) {
      const studentResult = fetchAttempt.result;

      if (studentResult >= 237 && studentResult <= 265) {
        return res.status(200).json({ message: "High Proficiency!!" });
      } else if (studentResult >= 215 && studentResult <= 236) {
        return res.status(200).json({ message: "Proficient!!" });
      } else if (studentResult >= 170 && studentResult <= 214) {
        return res.status(200).json({ message: "Emerging Proficiency!!" });
      } else if (studentResult >= 148 && studentResult <= 169) {
        return res.status(200).json({ message: "Limited Proficiency!!" });
      } else if (studentResult >= 53 && studentResult <= 147) {
        return res.status(200).json({ message: "Basic Proficiency!!" });
      } else {
        return res.status(400).json({ message: "Invalid Result Data!!" });
      }
    } else {
      return res.status(404).json({ message: "Failed to Fetch the Result!!" });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
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
        [Sequelize.col("lsmtAttempts.result"), "result"], // Fetch the result from lsmtAttempt table
      ],
      include: [
        {
          model: DBMODELS.lsmtAttempt,
          as: "lsmtAttempts",
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
    // console.log(generateEmailTemplate);

    const result = await sendMail(parentEmail, subject, body);

    if (result.success) {
      console.log(`Successfully sent email to ${parentEmail}.`);

      // Here we need to update the lsmtAttempt table's emailSent field to true

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
    const studentData = await DBMODELS.lsmtFeedback.findOne({
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

      await DBMODELS.lsmtFeedback.update(
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
      const newFeedbackEntry = await DBMODELS.lsmtFeedback.create({
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
  console.log(instituteId, studentId, feedback);
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
    const studentData = await DBMODELS.lsmtFeedback.findOne({
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

      await DBMODELS.lsmtFeedback.update(
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
      const newFeedbackEntry = await DBMODELS.lsmtFeedback.create({
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
    console.log("Error Found!! ", error);
    return {
      message_id: 5,
      message: error.message,
    };
  }
};

const handleFeedback = async (req, res) => {
  const { userId, studentId, role, feedback } = req.body;
  console.log(userId, studentId, role, feedback);
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
      console.log("institute Func called!!");
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
    const studentFeedbackData = await DBMODELS.lsmtFeedback.findOne({
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

module.exports = {
  postAttempt,
  getAttempt,
  getAllQuestion,
  lsmtResult,
  handleFeedback,
  testAttendees,
  parentEmailResult,
  getFeedbackData,
  // studentBasedOnClass,
};
