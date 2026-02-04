const { Op } = require("sequelize");
const { DBMODELS } = require("../database/models/init-models");
const schedule = require("node-schedule");
const moment = require("moment");
const { sendTemplatedEmail } = require("./email");
const logg = require("../utils/utils");
let courseNotCompletedList = [];

const studentNotCompletedCourse = async (req, res) => {
  try {
    const courseEnrolleds = await DBMODELS.certificates.findAll();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const studentIds = courseEnrolleds.map(
      (courseEnrolled) => courseEnrolled.studentId
    );
    const filteredStudents = await DBMODELS.students.findAll({
      attributes: ["email", "first_name", "createdAt"],
      raw: true,
      where: {
        email: { [Op.notIn]: studentIds },
        createdAt: {
          [Op.between]: [
            moment(sevenDaysAgo).startOf("day").format(),
            moment(sevenDaysAgo).endOf("day").format(),
          ],
        },
      },
    });

    courseNotCompletedList = courseNotCompletedList.concat(filteredStudents);
  } catch (error) {
    logg.error(error);
  }
};

module.exports = { studentNotCompletedCourse };

setInterval(() => {
  if (courseNotCompletedList.length) {
    let emailProcessing = courseNotCompletedList.splice(0, 20);
    sendMailForCourseCompletion(emailProcessing);
  }
}, 60000);

function sendMailForCourseCompletion(emailProcessing) {
  if (emailProcessing.length) {
    emailProcessing.map((list) => {
      sendTemplatedEmail(
        {
          email: "gowot87891@edulena.com",
          subject:
            "Reminder: You have not completed the G20 Orientation Module!",
        },
        { name: list.first_name },
        "COURSE_REMINDER"
      );
    });
  }
}
