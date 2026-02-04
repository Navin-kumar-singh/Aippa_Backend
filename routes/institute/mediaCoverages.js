/* 
   ========= Institute Media and Commuinque Control =========
   - Add / fetch / delete media 
   - Add / fetch / delete Communique 
 */

const { s3deleteObject } = require("../../aws/s3ObjectFunctions");
const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");

async function mediaUpload(req, res) {
  const instituteId = req.user.id;
  const { title, desc, link } = req.body;
  if (title && desc && req.file) {
    try {
      const data = await DBMODELS.mediaCoverages.create({
        img: req.file?.location ?? "",
        title,
        link,
        desc,
        instituteId,
      });
      res
        .status(200)
        .json({ message: "Data Posted Successfully", result: data });
    } catch (error) {
      logg.error(error);
      res.status(204).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(201).json({
      message: "Data Not Found",
    });
  }
}

async function fetchMedia(req, res) {
  const instituteId = req.user.id;
  if (instituteId) {
    DBMODELS.mediaCoverages
      .findAll({ where: { instituteId } })
      .then((result) => {
        res.json({ status: true, result });
      })
      .catch((error) => {
        logg.error(error);
      });
  } else {
    res.json({ status: false });
  }
}
async function deleteMedia(req, res) {
  const { id } = req.query;
  try {
    const { img } = await DBMODELS.mediaCoverages.findByPk(id);
    if (img) {
      s3deleteObject(img);
    }
  } catch (err) {
    logg.error(err);
  }

  await DBMODELS.mediaCoverages
    .destroy({
      where: { id },
    })
    .then((result) => {
      res.json({ status: true, data: result });
    })
    .catch((error) => {
      logg.error(error);
      res.json({ status: false, error });
    });
}

function uploadCommuinque(req, res) {
  const instituteId = req.user?.id;
  const body = req.body;
  try {
    if (body && instituteId) {
      DBMODELS.documents
        .create({
          title: body?.title,
          desc: body?.desc,
          file: req.file?.location,
          link: body?.link,
          instituteId,
          type: "COMMUINQUE",
        })
        .then((result) => {
          res.json({ status: true, message: "Data Uploaded.", result });
        });
    } else {
      res.json({ status: false, message: "Data Not Found!!" });
    }
  } catch (error) {
    logg.error(error);
    res.json({ status: false, message: "Something Went Wrong!!" });
  }
}

function fetchCommuinque(req, res) {
  const instituteId = req.user?.id;
  DBMODELS.documents
    .findAll({
      where: { instituteId, type: "COMMUINQUE" },
    })
    .then((result) => {
      res.json({ status: true, message: "Data fetched..", result });
    })
    .catch((error) => {
      res.json({ status: false, message: "Something Went Wrong" });
    });
}
async function deleteCommuinque(req, res) {
  const { id } = req.query;
  try {
    const { file } = await DBMODELS.documents.findByPk(id);
    if (file) {
      s3deleteObject(file);
    }
  } catch (err) {
    logg.error(err);
  }
  DBMODELS.documents
    .destroy({
      where: { id, type: "COMMUINQUE" },
    })
    .then((result) => {
      res.json({ status: true, message: "Data Deleted..", result });
    })
    .catch((error) => {
      res.json({ status: false, message: "Something Went Wrong" });
    });
}

module.exports = {
  mediaUpload,
  fetchMedia,
  deleteMedia,
  uploadCommuinque,
  fetchCommuinque,
  deleteCommuinque,
};
