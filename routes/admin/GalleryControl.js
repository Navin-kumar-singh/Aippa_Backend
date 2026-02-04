const { Op, Sequelize } = require("sequelize");
const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");
const sequelize = require("../../database/connection");
const { s3deleteObject } = require("../../aws/s3ObjectFunctions");
const { raw } = require("body-parser");

// function fetchOfflineEvent(req,res){
//   const body = req.body;
//   DBMODELS.offline_event
// }

function AddGalleryEvent(req, res) {
  const body = req.body;
  body.createdBy = req?.user?.email;
  body.thumbnail = req.file?.Location;
  if (body?.instituteId && body?.name) {
    DBMODELS.gallery
      .create(body)
      .then(() => {
        res.json({ status: 200, message: "Event Created" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "something went wrong" });
      });
  } else {
    res.json({ status: 201, message: "Data Missing!" });
  }
}
async function fetchGalleryEvent(req, res) {
  const { offset, limit, search } = req.query;
  let searchCondiation = {};
  if (search) {
    searchCondiation = {
      [Op.or]: [
        { name: { [Op.like]: "%" + search + "%" } },
        { theme: { [Op.like]: "%" + search + "%" } },
        { instituteName: { [Op.like]: "%" + search + "%" } },
        { location: { [Op.like]: "%" + search + "%" } },
      ],
    };
  }
  const count = await DBMODELS.gallery.count();
  let result;
  try {
    if (offset?.length && limit?.length) {
      result = await DBMODELS.gallery.findAll({
        offset: offset ? Number(offset) : 0,
        limit: limit ? Number(limit) : 25,
        where: searchCondiation,
      });
    } else {
      result = await DBMODELS.gallery.findAll();
    }
    res.json({ result, count });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
    logg.error(err);
  }
}

async function fetchInstituteGalleryEvent(req, res) {
  const { offset, limit, search } = req.query;
  const count = await DBMODELS.institute_gallery.findAll({
    attributes: [
      [Sequelize.fn("DISTINCT", Sequelize.col("instituteId")), "ID"],
    ],
    raw: true,
    where: {
      instituteId: {
        [Op.in]: sequelize.literal("(SELECT id FROM institutions)"),
      },
    },
  });
  sequelize
    .query({
      query: `SELECT
      inst.slug as id,
      inst.institution_name,
      inst.logo,
      inst.state,
      inst.district,
      board.appointment_date,
      board.theme,
      gallery.img as gallery_thumbnail
    FROM
      institutions AS inst
      LEFT JOIN institute_onboard AS board ON board.instituteId = inst.id
      LEFT JOIN (
        SELECT
          MIN(id) AS thumbnail_id,
          instituteId,
          img
        FROM
          institute_gallery
        GROUP BY
          instituteId
      ) AS gallery ON gallery.instituteId = inst.id
    WHERE
      inst.id IN (SELECT DISTINCT instituteId FROM institute_gallery) 
      AND (inst.institution_name LIKE "%${search ?? ""}%" OR inst.state LIKE "%${search ?? ""}%" OR inst.district LIKE "%${search ?? ""}%")
      ${limit ? `LIMIT ${limit} OFFSET ${offset}` : ""}
    `,
    })
    .then(([result]) => {
      res.json({ result, count: count.length });
    })
    .catch((err) => {
      logg.error(err);
      res.status(500).json({ message: "Something went Wrong!" });
    });
}

async function fetchInstituteGalleryImages(req, res) {
  const { id, offset, limit } = req.query;
  const ID = await DBMODELS.institutions.findOne({
    where: { slug: id },
    attributes: ["id"],
    raw: true,
  });
  const count = await DBMODELS.institute_gallery.count({
    where: {
      instituteId: ID?.id,
    },
    raw: true,
  });
  DBMODELS.institute_gallery
    .findAll({
      where: {
        instituteId: ID?.id,
      },
      limit: limit ? Number(limit) : 100,
      offset: offset ? Number(offset) : 0,
    })
    .then((result) => {
      res.json({ result, count });
    })
    .catch((err) => {
      logg.error(err);
      res.json({ message: "Somete thing Went Wrong!" });
    });
}

async function deleteInstituteGalleryImage(req, res) {
  const { id } = req.query;
  const { img } = await DBMODELS.institute_gallery.findOne({
    where: { id },
    raw: true,
    attributes: ["img"],
  });
  s3deleteObject(img);
  DBMODELS.institute_gallery
    .destroy({ where: { id } })
    .then((result) => {
      res.json({ message: "image delete successfully!" });
    })
    .catch((err) => {
      logg.error(err);
      res.status(500);
    });
}
async function updateInstituteGalleryImage(req, res) {
  const { id, update } = req.query;
  const permission = {};
  switch (update) {
    case "hide":
      permission.hide = true;
      break;
    case "show":
      permission.hide = false;
  }
  DBMODELS.institute_gallery
    .update({ permission: JSON.stringify(permission) }, { where: { id } })
    .then(() => {
      res.json({ message: "image updated successfully!" });
    })
    .catch((err) => {
      logg.error(err);
      res.status(500);
    });
}

function UploadGalleryImage(req, res) {
  const body = req.body;
  body.link = req.file?.Location;
  if (body?.link) {
    DBMODELS.gallery_images
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

async function FetchGalleryImage(req, res) {
  const { id, offset, limit } = req.query;
  const count = await DBMODELS.gallery_images.count({ where: { eventId: id } });

  if ((offset, limit)) {
    DBMODELS.gallery_images
      .findAll({
        where: { eventId: id },
        limit: Number(limit) ?? 20,
        offset: Number(offset) ?? 0,
      })
      .then((result) => {
        res.json({ result, count });
      })
      .catch((err) => {
        logg.error(err);
        res.json({ message: "Somete thing Went Wrong!" });
      });
  } else {
    DBMODELS.gallery_images
      .findAll({ where: { eventId: id } })
      .then((result) => {
        res.json({ result, count });
      })
      .catch((err) => {
        logg.error(err);
        res.json({ message: "Somete thing Went Wrong!" });
      });
  }
}
module.exports = {
  AddGalleryEvent,
  fetchGalleryEvent: fetchInstituteGalleryEvent,
  UploadGalleryImage,
  FetchGalleryImage: fetchInstituteGalleryImages,
  deleteInstituteGalleryImage,
  updateInstituteGalleryImage,
};
