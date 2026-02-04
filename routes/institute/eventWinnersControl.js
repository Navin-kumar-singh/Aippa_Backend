const { DBMODELS } = require("../../database/models/init-models");
const users = require("../../database/models/users");
const logg = require("../../utils/utils");

function addEventWinner(req, res) {
  const body = req.body;
  body.instituteId = req.user.id;
  if (body?.studentId && body?.instituteId) {
    DBMODELS.event_winners
      .findOrCreate({
        where: { studentId: body.studentId },
        defaults: body,
        raw: true,
      })
      .then(([users, created]) => {
        if (created) {
          res.json({ status: 200, message: "Winner Added Successfully" });
        } else {
          DBMODELS.event_winners
            .update(body, { where: { id: users.id } })
            .then(() => {
              res.json({ status: 200, message: "Winner Added Successfully" });
            })
            .catch((err) => {
              res.status(400).json({ message: "Something went wrong" });
            });
        }
      })
      .catch((err) => {
        res.status(400).json({ message: "Something went wrong" });
      });
  }
}

function fetchAllEventWinner(req, res) {
  const id = req.user.id;
  if (id) {
    DBMODELS.event_winners
      .findAll({
        where: { instituteId: id },
        raw: true,
      })
      .then((result) => {
        res.json({ status: 200, result });
      })
      .catch((err) => {
        logg.error(err);
        res.status(400).json({ message: "Something went wrong" });
      });
  }
}
function deleteEventWinner(req, res) {
  const { id } = req.query;
  if (id) {
    DBMODELS.event_winners
      .destroy({ where: { studentId: id } })
      .then(() => {
        res.json({ status: 200, message: "Winner Deleted Successfully" });
      })
      .catch((err) => {
        logg.error(err);
        res.status(400).json({ message: "Something went wrong" });
      });
  }
}

module.exports = { addEventWinner, fetchAllEventWinner, deleteEventWinner };
