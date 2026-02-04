/*
  ==========Institute Coordinator Control========= 
  - fetch / update / delete Coordinator
  - fetch all coordinator
 */

const { uid } = require("uid");
const { DBMODELS } = require("../../database/models/init-models");
const { mysqlcon } = require("../../model/db");
const sendEmailService = require("../../service/email");
const { use } = require("../course/course");
const { hashingPassword } = require("../auth/validation");
const { Op } = require("sequelize");
const logg = require("../../utils/utils");

/* Functionality :- addCoordinator function add a new student coordinator in institute_coordinators table*/
async function addCoordinator(req, res) {
  try {
    const instituteId = req.user.id;
    const { name, email, contact, designation } = req.body;
    if (name && email && contact && designation && instituteId) {
      const checkCoord = await DBMODELS.institute_coordinators.findOne({
        where: {
          [Op.or]: [{ email }, { contact }]
        }
      })
      const checkInstitute = await DBMODELS.institutions.findOne({
        where: {
          [Op.or]: [{ email }, { contact }]
        }
      })
      const checkStudent = await DBMODELS.students.findOne({
        where: {
          [Op.or]: [{ email }, { contact }]
        }
      })
      if (!checkCoord && !checkInstitute && !checkStudent) {
        const password = "@Yuva" + uid(4);
        const encPass = await hashingPassword(password);
        const addCoord = await DBMODELS.institute_coordinators.upsert({ name, email, contact, designation, instituteId, password: encPass });
        if (addCoord) {
          let mailConfig = {
            email,
            subject: "Congrats! You are appointed as Teacher Coordinator",
            password
          };
          let replacements = {
            username: name,
            email,
            password
          };
          sendEmailService.sendTemplatedEmail(mailConfig, replacements, 3);
          res.json({ status: "success", message: "Coordinator Added Successfully" });
        }
      } else {
        res.json({ status: "warning", message: "Account Already Exist" })
      }
    } else {
      res.json({ status: "warning", message: "Data Missing" });
    }
  } catch (error) {
    logg.error(error)
    res.json({ status: "error", message: "Something Went Wrong try again" })
  }
}



/* Functionality :- updateCoordinator function update data of a student coordinator in institute_coordinators table according to coordinatorId and instituteId */

function updateCoordinator(req, res) {
  const instituteId = req.user.id;
  const { coordinatorId, name, email, contact, designation } = req.body;
  if (coordinatorId && instituteId && name && email && contact && designation) {
    sql = `UPDATE institute_coordinators SET name='${name}',email='${email}',contact='${contact}',designation='${designation}' WHERE id='${coordinatorId}' AND instituteId='${instituteId}'; `;
    mysqlcon.query(sql, function (err, result) {
      if (err) {
        logg.error(err);
        return res.status(500).json({ message: "Internal Server Error", err });
      }
      return res
        .status(200)
        .json({ message: "Coordinator Updated Successfully", result });
    });
  } else {
    res.status(404).json({ message: "data Missing", Data: req.body });
  }
  //Update Cooridnator
}


/* Functionality :- DeleteCoordinator function delete a student coordinator from institute_coordinators table according to coordinatorId and instituteId*/

function DeleteCoordinator(req, res) {
  const instituteId = req.user.id;
  const coordinatorId = req.query.id;
  if (coordinatorId && instituteId) {
    sql = `DELETE FROM institute_coordinators WHERE id='${coordinatorId}' AND instituteId='${instituteId}'; `;
    mysqlcon.query(sql, function (err, result) {
      if (err) {
        logg.error(err);
        return res.status(500).json({ message: "Internal Server Error", err });
      }
      return res
        .status(200)
        .json({ message: "Coordinator Deleted", result });
    });
  } else {
    res.status(404).json({ message: "data Missing", Data: req.body });
  }
  //Update Cooridnator
}


/* Functionality :- fetchCoordinator function fetch data of a student coordinator from institute_coordinators table according to coordinatorId and instituteId*/

function fetchCoordinator(req, res) {
  const instituteId = req.user.id;
  const { coordinatorId } = req.body;
  if (coordinatorId && instituteId) {
    sql = `SELECT * FROM institute_coordinators WHERE id='${coordinatorId}' AND instituteId='${instituteId}'; `;
    mysqlcon.query(sql, function (err, result) {
      if (err) {
        logg.error(err);
        return res.status(500).json({ message: "Internal Server Error", err });
      } else if (result.length) {
        return res.status(200).json({ message: "Coordinator Date", result });
      } else {
        return res
          .status(200)
          .json({ message: "Coordinator Date Not Found!!!" });
      }
    });
  } else {
    res.status(404).json({ message: "data Missing", Data: req.body });
  }
  //Update Cooridnator
}


/* Functionality :- fetchCoordinator function fetch data of all student coordinators  of a particular institute from institute_coordinators table according to instituteId*/


function fetchAllCoordinator(req, res) {
  const instituteId = req.user.id;
  if (instituteId) {
    sql = `SELECT * FROM institute_coordinators WHERE instituteId='${instituteId}' `;
    mysqlcon.query(sql, function (err, result) {
      if (err) {
        logg.error(err);
        return res.status(500).json({ message: "Internal Server Error", err });
      } else if (result.length) {
        return res.status(200).json({ message: "Coordinator Date", result });
      } else {
        return res
          .status(200)
          .json({ message: "Coordinator Date Not Found!!!" });
      }
    });
  } else {
    res.status(404).json({ message: "data Missing", Data: req.body });
  }
  //Update Cooridnator
}

module.exports = {
  addCoordinator,
  updateCoordinator,
  DeleteCoordinator,
  fetchCoordinator,
  fetchAllCoordinator,
};
