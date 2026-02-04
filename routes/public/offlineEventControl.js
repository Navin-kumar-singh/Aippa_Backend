const { s3deleteObject } = require("../../aws/s3ObjectFunctions");
const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");

// function fetchOfflineEvent(req,res){
//   const body = req.body;
//   DBMODELS.offline_event
// }

function addOfflineEvent(req, res) {
  const body = req.body;
  if (body?.instituteId && body?.name && body?.teacherId) {
    DBMODELS.offline_event
      .create(body)
      .then(() => {
        res.json({ status: 200, message: "Event Created" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "something went wrong" });
      });
  } else {
    res.json({ status: 404, message: "Data Missing!" });
  }
}
function fetchOfflineEvent(req, res) {
  const body = req.query;
  if (body.instituteId) {
    DBMODELS.offline_event
      .findAll({ where: body })
      .then((result) => {
        res.json({ result });
      })
      .catch((err) => {
        res.status(500).json({ message: "something went wrong" });
      });
  } else {
    res.json({ status: 404, message: "Data Missing!" });
  }
}

function uploadEventImage(req, res) {
  const body = req.body;
  body.link = req.file?.Location;
  if (body?.instituteId && body?.teacherId && body?.link) {
    DBMODELS.offline_event_images
      .create(body)
      .then((result) => {
        res.json({ status: 200, message: "Image Uploaded" });
      })
      .catch((err) => {
        logg.error(err);
        res.json({ status: 500, message: "Something Went Wrong!" });
      });
  } else {
    res.json({ status: 404, message: "Image is Not Supported!" });
  }
}

function fetchEventImage(req, res) {
  const { id } = req.query;
  DBMODELS.offline_event_images
    .findAll({ where: { eventId: id } })
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => {
      logg.error(err);
      res.json({ message: "Somete thing Went Wrong!" });
    });
}
async function deleteEventImage(req, res) {
  logg.info(req.query);
  const { id } = req.query;
  const { link } = await DBMODELS.offline_event_images.findByPk(id, {
    raw: true,
    attributes: ["link"],
  });
  DBMODELS.offline_event_images
    .destroy({ where: { id } })
    .then(() => {
      s3deleteObject(link);
      res.json({ message: "Image deleted successfully." });
    })
    .catch((error) => {
      console.error(error);
      res.json({ message: "Error In Deleteing Image!!" });
    });
}
module.exports = {
  addOfflineEvent,
  fetchOfflineEvent,
  uploadEventImage,
  fetchEventImage,
  deleteEventImage,
};
