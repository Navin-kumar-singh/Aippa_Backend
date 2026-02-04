/*
  ========= Student coordinator Control =======
 */
const { DBMODELS } = require("../../database/models/init-models");
const { Op } = require("sequelize");
const logg = require("../../utils/utils");
const sendEmailService = require("../../service/email");


/* Functionality :- addStdCoordinator function add the student_coordinator in student_coordinators table according to studentId and instituteId*/


const addStdCoordinator = async (req, res) => {
  const instituteId = req.user.id;
  const { id, first_name, last_name, email, contact } = req.body;
  try {
    const [result, Create] = await DBMODELS.student_coordinators.findOrCreate({
      where: { studentId: id, instituteId },
      defaults: {
        name: first_name + last_name,
        email,
        contact,
        studentId: id,
        instituteId,
      },
    });
    if (Create) {
      const institute = await DBMODELS.institutions.findOne({
        where: {
          id: instituteId,
        },
      });
      res
        .status(201)
        .json({ message: "Coordinator Added Successfuly.", result });
      // Sending Email
      const participation_link =
        process.env.FRONTEND_URL + "institute/" + institute?.slug;
      let mailConfig = {
        email: email,
        subject: "Congratulations! You are added as a Student Coordinator",
      };
      let replacements = {
        username: first_name + " " + last_name,
        participation_link: participation_link,
      };
      sendEmailService.sendTemplatedEmail(mailConfig, replacements, 6);
      //End Email Sending
    } else {
      res
        .status(208)
        .json({ message: "Student Already Added to Coordinators", result });
    }
  } catch (err) {
    logg.error(err);
    res.status(500).json({ message: "Internal server error!! " });
  }
};




const getStdCoordinater = async (req, res) => {
  const instituteId = req.user.id;
  // const { studentId, first_name, last_name, email, contact } = req.body;
  try {
    const result = await DBMODELS.students.findAll({
      include: [
        {
          model: DBMODELS.student_coordinators,
          as: "student_coordinator",
          right: true,
        },
        {
          model: DBMODELS.g20_delegates,
          as: "g20_delegates",
        },
      ],
      where: { instituteId: [instituteId] },
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal server error!! " });
    logg.error(err);
  }
};
const deleteStdCoordinater = async (req, res) => {
  const instituteId = req.user.id;
  const { studentId } = req.query;
  try {
    const result = await DBMODELS.student_coordinators.destroy({
      where: { instituteId: [instituteId], studentId: [studentId] },
    });
    res
      .status(200)
      .json({ message: "Coordinator Deleted Successfuly.", result });
  } catch (err) {
    res.status(500).json({ message: "Internal server error!! " });
    logg.error(err);
  }
};

module.exports = { addStdCoordinator, getStdCoordinater, deleteStdCoordinater };
